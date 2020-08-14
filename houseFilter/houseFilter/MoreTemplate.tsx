import React, {useState} from "react";
import {View} from "@tarojs/components";
import classNames from 'classnames';
import {AtButton} from "taro-ui";
import ButtonBox from "./ButtonBox";
import styles from "./index.module.less";
import {cloneDeep, dataFormatResult, getListKeyId, selectItem} from "./Index";

const initState = (data) => {
    data.map(v => v.Children.map(k => {
        k.select = false
    }));
    return [...data];
}

const MoreTemplate = (props) => {

    let [data, setData]: any = useState(cloneDeep(props.data));

    const onSelectClick = (index1, index2, checkbox) => {
        let item = data[index1].Children[index2];
        if (checkbox) {
            data[index1].Children.map(k => (k.KeyId === '' && (k.select = false)));
            data[index1].Children[index2].select = !item.select;
            setData([...data]);
        } else {
            data[index1].Children.map(k => (k.select = false));
            data[index1].Children[index2].select = !item.select;
            setData([...data]);
        }
    }
    const onReset = () => {
        setData(initState(data));
    }

    const onSubmit = () => {
        let payload = data.map(v => selectItem(v.Children)).map((v, i) => dataFormatResult(data[i].KeyName, getListKeyId(v))).filter(v => v.value.length > 0);
        props.onSubmit && props.onSubmit(props.index, {payload}, data);
    }


    return (
        <View className={classNames(styles.filterListBox, styles.moreRent)}>
            {
                data.map((v: any, index1) => (
                    <View key={v.Name} className={styles.model}>
                        <View className={styles.modelTitle}>{v.Name}</View>
                        <View className={classNames(styles.modelBox, styles.select)}>
                            {
                                v?.Children?.map((k: any, index2) => (
                                    <AtButton key={k.Name} size='small'
                                              onClick={() => onSelectClick(index1, index2, v.Type === 'Checkbox' ? true : false)}
                                              className={classNames(styles.modelItem, k.select ? styles.selectButton : styles.unSelectButton)}
                                    >{k.Name}{k.select}</AtButton>
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

export default MoreTemplate;
