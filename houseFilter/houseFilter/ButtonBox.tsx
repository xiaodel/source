import React from "react";
import protoType from 'prop-types';
import {View} from "@tarojs/components";
import styles from "./index.module.less";
import {AtButton} from "taro-ui";

const ButtonBox = (props) => {
    return (
        <View className={styles.bottomButtonBox}>
            <AtButton
                circle={false}
                className={styles.resetButton}
                onClick={() => props.onReset()}
            >重置</AtButton>
            <AtButton
                circle={false}
                className={styles.confirmButton}
                onClick={() => props.onSubmit()}
            >确定</AtButton>
        </View>
    )
}

ButtonBox.propTypes = {
    onReset: protoType.func.isRequired,
    onSubmit: protoType.func.isRequired,
}
export default ButtonBox;
