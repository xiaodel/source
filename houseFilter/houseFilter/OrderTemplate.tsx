import React, {useState} from "react";
import {View} from "@tarojs/components";
import classNames from 'classnames';
import styles from "./index.module.less";
import {dataFormatResult} from "./Index";

const OrderTemplate = (props) => {

    let [data]: any = useState(props.data);

    const onSubmit = (index) => {
        data.Children.map((v, i) => (i === index ? v.select = true : v.select = false));
        let payload =[ dataFormatResult('OrderId',data.Children[index].KeyId)];
        props.onSubmit && props.onSubmit(props.index, {payload}, data);
    }

    return (
        <View className={classNames(styles.filterListBox, styles.sort, styles.select)}>
            {
                data.Children.map((v, i) => (
                    <View key={v.KeyId}
                          className={classNames(styles.item, {[styles.selectText]: v.select})}
                          onClick={() => onSubmit(i)}
                    >{v.Name}</View>
                ))
            }
        </View>
    )
}

export default OrderTemplate;
