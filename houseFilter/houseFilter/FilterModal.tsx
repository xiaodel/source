import React, {
    useState,
    forwardRef,
    useImperativeHandle,
} from "react";
import {Text, View} from "@tarojs/components";
import {AtIcon} from "taro-ui";
import classNames from 'classnames';
import styles from "./index.module.less";
// import protoType from "prop-types";

const selectDefaultIndex = -1;
const FilterModal = (props, ref) => {

    let data = props.readerData;


    const [showModal, setShowModal] = useState(false);
    const [selectIndex, setSelectIndex] = useState(selectDefaultIndex);

    const onTitleClick = (index) => {
        if (selectIndex === index) {
            setSelectIndex(selectDefaultIndex);
            setShowModal(showModal => !showModal);
        } else {
            setSelectIndex(index);
            setShowModal(true);
        }
    }
    const onHiddenWrapper = () => {
        props.onHidden && props.onHidden();
        setShowModal(false);
        setSelectIndex(selectDefaultIndex);
    }

    const onStopPropagation = (e) => {
        e.stopPropagation();
    }

    useImperativeHandle(ref, () => ({

        onHidden: () => {
            setShowModal(false);
            setSelectIndex(selectDefaultIndex);
        }
    }));

    return (
        <View className={styles.filterContainer}>

            <View className={classNames(styles.filterTitle, {[styles.filterTitleForceFixed]: showModal})}>
                {
                    data.map((v, index) => (
                        <View
                            key={`${index}`}
                            className={classNames(styles.filterTitleItem, {[styles.select]: selectIndex === index})}
                            onClick={() => onTitleClick(index)}>
                            {
                                v.icon ? v.icon : (
                                    <View>
                                        <Text
                                            className={classNames(styles.oneLine, styles.selectText)}>{v.title}</Text>
                                        <AtIcon
                                            className={classNames({[styles.selectText]: selectIndex === index})}
                                            size={15}
                                            value='chevron-down'/>
                                    </View>
                                )
                            }
                        </View>
                    ))
                }
            </View>

            {
                showModal && (
                    <View className={styles.filterWrapper} style={{display:showModal?'block':'none'}} onClick={() => onHiddenWrapper()}>
                        {
                            data.map((v, index) => (
                                    <View key={index}
                                          onClick={onStopPropagation}
                                          className={classNames(styles.filterList, {[styles.filterListShow]: selectIndex === index})}>
                                        {v.reader}
                                    </View>
                                )
                            )
                        }
                    </View>
                )
            }

        </View>
    );
}


// PageIndex.propTypes = {
//     readerData: protoType.array.isRequired,
//     onSubmit: protoType.func.isRequired,
//     onHidden: protoType.func.isRequired,
// }

export default forwardRef(FilterModal);
