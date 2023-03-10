import React from 'react';
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from 'antd';
const CustomSpinner = () => {
    return <Spin indicator={<LoadingOutlined spin />} />
};

export default CustomSpinner;