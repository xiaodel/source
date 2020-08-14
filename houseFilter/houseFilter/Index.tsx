import React, {useEffect, useRef, useState} from "react";
import propTypes from 'prop-types';
import FilterModal from './FilterModal';
import AreaTemplate from './AreaTemplate';
import RentTypeTemplate from './RentTypeTemplate';
import MoneyTemplate from './MoneyTemplate';
import MoreTemplate from './MoreTemplate';
import OrderTemplate from './OrderTemplate';
import {AtIcon} from "taro-ui";

import mockJson from './mock.json';

let {DistrictSubway, RentType, RentMoney, More, Order} = mockJson.Data;


const FilterIndex = (props) => {

    let defaultData = props.initData;
    const initData = [initDistrictSubway(formatData(DistrictSubway), defaultData), initRentType(formatData(RentType), defaultData['RentType']), formatData(RentMoney), formatData(More), formatData(Order)];

    let [data, setData]: any = useState(initData);
    let [submitData, setSubmitData]: any = useState([]);


    const onSubmit = (index, payload, variationData) => {
        console.warn('onSubmit index:', index, 'data:', payload, variationData);

        data[index].initData = payload.initData;
        data[index].data = variationData;
        setData([...data]);

        submitData[index] = payload.payload;
        setSubmitData([...submitData]);

        props.onSubmit && props.onSubmit(formatSubmit(submitData));

        ref.current.onHidden();
    }

    const ref: any = useRef();

    const onHidden = () => {
        setData([...data]);
    }

    let params = {
        onSubmit,
    }

    const readerData = [
        {
            title: '成都',
            reader: <AreaTemplate {...params} index={0} {...data[0]}/>,
        },
        {
            title: '整租/合租',
            reader: <RentTypeTemplate  {...params} index={1} {...data[1]}/>,
        },
        {
            title: '价格',
            reader: <MoneyTemplate  {...params} index={2} {...data[2]}/>,
        },
        {
            title: '更多',
            reader: <MoreTemplate  {...params} index={3} {...data[3]}/>,
        },
        {
            icon: <AtIcon size={20} value='filter'/>,
            reader: <OrderTemplate {...params} index={4} {...data[4]}/>,
        }
    ]

    return (
        <FilterModal
            ref={ref}
            onSubmit={onSubmit}
            onHidden={onHidden}
            readerData={readerData}
        />
    )
}

export const selectItem = (list) => {
    return list.filter(v => v.select);
}


export const getListKeyId = (list) => {
    return list.map(v => v.KeyId);
}

export const dataFormatResult = (KeyName, value) => {
    return {KeyName, value};
}

export const cloneDeep = (data) => {
    return data ? JSON.parse(JSON.stringify(data)) : null;
}


const formatData = (data) => {

    return {data:cloneDeep(data)};
}

const initRentType = (data, initData) => {
    if (initData) {
        data.data.map(v => {
            if (v.KeyId == initData[0]) {
                v.Children.map(k => {
                    if (k.KeyId == initData[1]) {
                        k.select = true;
                    }
                })
            }
        })
    }
    return data;
}

const initDistrictSubway = (data, initData) => {

    const computer = () => {

        let menu1 = [
            {Name: '区域', KeyId: '0', select: true},
            {Name: '地铁', KeyId: '1', select: false},
            {Name: '附近', KeyId: '2', select: false}
        ], menu2 = [...data.data[Object.keys(data.data)[0]]], menu3 = [];

        if (initData) {
            let keys = Object.keys(initData);
            keys.map(v => {
                if (Object.keys(data.data).includes(v)) {
                    Object.keys(data.data).map((j, i) => (j === v ? menu1[i].select = true : menu1[i].select = false));
                    menu2 = data.data[v];
                    data.data[v].map(k => {
                        if (k.KeyId == initData[v][0]) {
                            k.select = true;
                            menu3 = k.Children;
                            k.Children.map(j => {
                                let keyId = initData[v][1];
                                if (keyId == undefined && j.KeyId == '') {
                                    j.select = true;
                                } else if (keyId == j.KeyId) {
                                    j.select = true;
                                }
                            })
                        }
                    })
                }
            });
            console.log('init data', data)
        }
        return [menu1, menu2, menu3];
    };

    data.initData = computer();


    return data;
}

const formatSubmit = (data) => {
    debugger
    let params = {};
    data?.map(v => v?.map(k => params[k.KeyName] = k.value));
    return params;
}

FilterIndex.propTypes = {
    onSubmit: propTypes.func.isRequired,
    initData: propTypes.object
}
FilterIndex.defaultProp = {
    initData: {}
}

export default FilterIndex;
