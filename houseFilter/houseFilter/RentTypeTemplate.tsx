import React, {useState} from "react";
import {View} from "@tarojs/components";
import {AtButton} from "taro-ui";
import classNames from 'classnames';
import propTypes from 'prop-types'
import ButtonBox from './ButtonBox';
import {selectItem, getListKeyId, dataFormatResult, cloneDeep} from './Index';
import styles from "./index.module.less";

const initState = (data) => {
    data.map(v => v.Children.map(k => {
        k.select = false
    }));
    return [...data];
}
const RentTypeTemplate = (props) => {

    let [data, setData]: any = useState(cloneDeep(props.data));

    const onSelectClick = (index1, index2) => {
        let item = data[index1].Children[index2];
        if (item.KeyId === '0') {
            data[index1].Children.map(k => {
                k.KeyId === '0' ? (k.select = true) : (k.select = false);
            })
        } else {
            data[index1].Children.map(k => {
                k.KeyId === '0' && (k.select = false);
            })
            data[index1].Children[index2].select = !item.select;
        }
        setData([...data]);
    }

    const onReset = () => {
        setData(initState(data));
    }

    const onSubmit = () => {
        let payload = data.map(v => selectItem(v.Children)).map((v, i) => dataFormatResult(data[i].KeyName, getListKeyId(v))).filter(v => v.value[0] !== '');
        props.onSubmit && props.onSubmit(props.index, {payload}, data);
    }


    return (
        <View className={classNames(styles.filterListBox, styles.rentType)}>
            {
                data.map((v: any, index1) => (
                    <View key={v.KeyId} className={styles.model}>
                        <View className={styles.modelTitle}>{v.Name}</View>
                        <View className={classNames(styles.modelBox, styles.select)}>
                            {
                                v.Children.map((k: any, index2) => (
                                    <AtButton key={k.KeyId} size='small'
                                              className={classNames(styles.modelItem, k.select ? styles.selectButton : styles.unSelectButton)}
                                              onClick={() => onSelectClick(index1, index2)}
                                    >
                                        {k.Name}
                                    </AtButton>
                                ))
                            }
                        </View>
                    </View>
                ))
            }

            <ButtonBox onReset={onReset} onSubmit={onSubmit}/>
        </View>
    )
}

RentTypeTemplate.propTypes = {
    onSubmit: propTypes.func.isRequired,
    index: propTypes.number.isRequired,
    data: propTypes.array.isRequired,
}

export default RentTypeTemplate;
