import React, {useState} from "react";
// import protoType from "prop-types";
import {Text, View} from "@tarojs/components";
import {AtButton, AtRange} from "taro-ui";
import classNames from 'classnames';
import ButtonBox from "./ButtonBox";
import styles from "./index.module.less";
import {cloneDeep, dataFormatResult, selectItem} from "./Index";

const initState = (data) => {
    data.Children.map(k => {
        k.select = false
    });
    return {...data};
}

const maxMoney = 6000;

const initRentMoneyData = {value: [0, maxMoney], select: false};
const MoneyTemplate = (props) => {

    let [data, setData]: any = useState(cloneDeep(props.data));

    const [rentMoney, setRentMoney]: any = useState(props.initData || initRentMoneyData);

    const onSelectClick = (index1) => {
        data.Children.map((v, i) => {
            i == index1 ? (v.select = true) : (v.select = false)
        });
        setData({...data});
        changeMoneyButton(index1);
    }

    const changeMoneyButton = (index) => {
        let item = data.Children[index];
        setRentMoney({value: [item.MinMoney, item.MaxMoney === 0 ? maxMoney : item.MaxMoney], select: false});
    }

    const onMoneyRangeChange = (value) => {
        setRentMoney({value, select: true});
        !rentMoney.select && setData(initState(data));
    }

    const onReset = () => {
        setData(initState(data));
        setRentMoney(initRentMoneyData);
    }

    const onSubmit = () => {
        let params: any = [], moneys: any = [];
        let payload: any = {};
        if (rentMoney.select) {
            moneys = rentMoney.value;
        } else {
            let item = selectItem(data.Children);
            if (item[0]) {
                let {MinMoney, MaxMoney} = item[0];
                moneys = [MinMoney, MaxMoney];
            }
        }
        params.push(dataFormatResult('MinMoney', moneys[0]));
        params.push(dataFormatResult('MaxMoney', moneys[1]));

        payload.payload = params;
        payload.initData = rentMoney;
        props.onSubmit && props.onSubmit(props.index, payload, data);
    }


    return (
        <View className={classNames(styles.filterListBox, styles.rentMoney)}>
            <View className={styles.model}>
                <View className={classNames(styles.modelBox, styles.select)}>
                    {
                        data.Children.map((v: any, index1) => (
                            <AtButton key={v.Name} size='small'
                                      className={classNames(styles.modelItem, v.select ? styles.selectButton : styles.unSelectButton)}
                                      onClick={() => {
                                          onSelectClick(index1);
                                      }}
                            >{v.Name}</AtButton>
                        ))
                    }
                </View>
            </View>
            <View className={styles.model}>
                <View className={classNames(styles.modelBox, styles.select)}>
                    <View style={{textAlign: "center", width: '100%'}}>
                        <Text className={classNames({[styles.selectText]: rentMoney.select})}>
                            {`¥${rentMoney.value[0]} - ¥${rentMoney.value[1] === maxMoney ? '不限' : rentMoney.value[1]}`}
                        </Text>
                    </View>
                    <AtRange
                        className={styles.moneyRange}
                        min={0}
                        max={maxMoney}
                        value={rentMoney.value}
                        onChange={onMoneyRangeChange}/>
                </View>
            </View>

            <ButtonBox onReset={onReset} onSubmit={onSubmit}/>
        </View>
    )
}

//
// PageIndex.propTypes = {
//     data: protoType.object.isRequired,
//     initData: protoType.object,
//     onSubmit: protoType.func.isRequired,
// }

export default MoneyTemplate;
