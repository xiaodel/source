import React, {useState} from "react";
// import protoType from "prop-types";
import classNames from 'classnames';
import {Checkbox, CheckboxGroup, Label, ScrollView, View} from "@tarojs/components";
import {cloneDeep, dataFormatResult, getListKeyId, selectItem} from "./Index";
import ButtonBox from "./ButtonBox";
import styles from "./index.module.less";

const AreaTemplate = (props) => {

    const [areaMenuData] = useState(() => {
        let data = cloneDeep(props.data);
        return cloneDeep([data.Region, data.Metro, data.Distance]);
    });
    const areaMenu = () => {
        return [
            [
                {Name: '区域', KeyId: '0', select: true},
                {Name: '地铁', KeyId: '1', select: false},
                {Name: '附近', KeyId: '2', select: false}
            ],
            [...areaMenuData[0]],
            [],
        ]
    };


    const bindSelectTab = (list, KeyId) => {
        return list.map(v => {
            v.KeyId === KeyId ? (v.select = true) : (v.select = false);
            return v;
        })
    }

    const [areaMenus, setAreaMenus]: any = useState(cloneDeep(props.initData) || areaMenu());

    const onAreaOneMenu = (item) => {
        let areaMenuList: any = [];
        areaMenuList[0] = areaMenus[0].map(v => {
            v.KeyId == item.KeyId ? (v.select = true) : (v.select = false);
            return v;
        });
        areaMenuList[1] = bindSelectTab(areaMenuData[item.KeyId], '');
        areaMenuList[2] = [];

        setAreaMenus([...areaMenuList]);
    }

    const onAreaTwoMenu = (item: any) => {

        const [one, two] = areaMenus;

        let selectTwo = bindSelectTab(two, item.KeyId);
        let temp = [one, selectTwo, []];
        setAreaMenus(temp);

        item.Children && bindSelectBox(item.Children, ['']);
    }

    const bindSelectBox = (list, KeyIdList) => {

        let item = KeyIdList[KeyIdList.length - 1];
        item = (item === undefined) ? '' : item;
        list = list.map(v => {
            if (item === '') {
                v.KeyId === '' ? (v.select = true) : (v.select = false);
            } else {
                if (v.KeyId === '') {
                    v.select = false;
                } else {
                    KeyIdList.includes(v.KeyId) ? (v.select = true) : (v.select = false);
                }
            }

            return v;
        });

        const [one, two] = areaMenus;
        let temp1 = [one, two, list || []];
        setAreaMenus(temp1);
    }

    const onSubmit = () => {
        let keyId1 = getListKeyId(areaMenus[1].filter(v => v.select));
        let keyId2 = getListKeyId(areaMenus[2].filter(v => v.select));

        let item = selectItem(areaMenus[0]);
        let payload: any = [];
        let id = item[0].KeyId;
        if (keyId1[0]) {
            if (id === '0') {
                payload.push(dataFormatResult('CountyCode', keyId1[0]));
                if (keyId2[0]) {
                    payload.push(dataFormatResult('BCID', keyId2));
                }
            } else if (id === '1') {
                payload.push(dataFormatResult('MetroLineName', keyId1[0]));
                if (keyId2[0]) {
                    payload.push(dataFormatResult('MetroStationName', keyId2));
                }
            } else if (id === '2') {
                payload.push(dataFormatResult('Distance', keyId1[0]));
            }
        }


        props.onSubmit && props.onSubmit(props.index, {payload, initData: areaMenus}, props.data);
    }

    const onReset = () => {
        setAreaMenus(areaMenu());
    }

    return (
        <View className={classNames(styles.filterListBox, styles.rentArea)}>

            <View className={styles.areaRegion}>
                <ScrollView className={styles.scrollView}
                            style={{width: '25%', backgroundColor: 'white'}} scrollY={true}>
                    <View className={styles.filterListLevel1}>
                        {
                            areaMenus[0].map((v: any) => (
                                <View
                                    key={v.KeyId}
                                    className={classNames(styles.level1Item, {[styles.select]: v.select})}
                                    onClick={() => onAreaOneMenu(v)}
                                >
                                    <View
                                        className={classNames(styles.icon, {[styles.select]: v.select})}/>
                                    <View className={styles.modelTitle}>{v.Name}</View>
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>
                <ScrollView className={styles.scrollView}
                            style={{
                                width: areaMenus[2].length > 0 ? '25%' : '75%',
                                backgroundColor: '#FCFCFC'
                            }} scrollY={true}>
                    <View className={classNames(styles.filterListLevel2, styles.select)}>
                        {
                            areaMenus[1].map((v: any) => (
                                <View key={v.KeyId}
                                      className={classNames(styles.level2Item, {[styles.selectText]: v.select})}
                                      onClick={() => onAreaTwoMenu(v)}
                                >{v.Name}</View>
                            ))
                        }
                    </View>
                </ScrollView>
                {
                    areaMenus[2].length > 0 &&
                    <ScrollView className={styles.scrollView}
                                style={{width: '50%', backgroundColor: '#F3F3F3'}} scrollY={true}>
                        <View className={styles.filterListLevel3}>
                            <CheckboxGroup
                                onChange={(e: any) => bindSelectBox(areaMenus[2], e.detail.value)}
                            >
                                {
                                    areaMenus[2].map((v: any) => (
                                        <Label key={v.KeyId}>
                                            <View className={styles.level3Item}>
                                                <View>{v.Name}</View>
                                                <Checkbox
                                                    value={v.KeyId}
                                                    checked={v.select}
                                                    disabled={v.KeyId === '' && v.select}
                                                    className={styles.checkbox}
                                                    color='white'
                                                    key={v}
                                                />
                                            </View>
                                        </Label>
                                    ))
                                }
                            </CheckboxGroup>
                        </View>
                    </ScrollView>
                }
            </View>

            <ButtonBox onReset={onReset} onSubmit={onSubmit}/>
        </View>
    )
}



// AreaTemplate.propTypes = {
//     data: protoType.object.isRequired,
//     onSubmit: protoType.func.isRequired,
//     initData: protoType.object,
// }

export default AreaTemplate;
