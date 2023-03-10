import React, { memo, useEffect, useState } from 'react';
import { Button, InputNumber, Modal, Skeleton, Table, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { FaLevelUpAlt } from "react-icons/fa"
import './PickupModal.css';
import Variants from '../Variants/Variants';

const { Title, Text } = Typography;
const { Column } = Table;

const columns = [
    {
        title: '',
        dataIndex: 'imgage',
        width: 50,
        render: (imgUrl, record) => (
            <div className='productImageDiv'>
                {imgUrl ? <img src={imgUrl} alt="product" /> : <Skeleton.Image active={false} />}
                <span>{record.product_details} - <Variants data={record.rest}/></span>
            </div>
        )
    },
    {
        title: '',
        dataIndex: 'quantity',
        width: 250,
        render: (quantity) => {
            return <span className="quantityInput">
                <InputNumber
                    min={0}
                    size='large'
                    disabled
                    defaultValue={quantity}
                    onChange={(value) => (value)}
                    controls={{ upIcon: <PlusOutlined />, downIcon: <MinusOutlined /> }}
                />
            </span>
        }
    },
]
const PickupModal = ({ showPickupModal, setShowPickupModal, productsData, handlepickUp, pickupLoading }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [items, setItems] = useState(0);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setselectedIds] = useState([]);
    const calculateItems = (data) => {
        const quantity = data.map(data => parseFloat(data.quantity));
        let total = quantity.reduce((a, b) => a + b, 0);
        setItems(total);
    }

    const onSelectChange = (newSelectedRowKeys, selectedRows) => {
        calculateItems(selectedRows);
        setSelectedRowKeys(newSelectedRowKeys);
        const rowId = selectedRows.map(({productsId})=> productsId);
       setselectedIds(rowId);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };


    const tableData = async () => {
        setLoading(true);
        const res = await productsData.map((data, index) => {
            const { product_name, imageUrl, price, id, quantity, day, charge, dayCount, status, stock, orderProductsId,productId,key, variationId,pickedUp,...rest } = data;
            return {
                index: index,
                key: index,
                imgage: imageUrl,
                product_details: product_name,
                quantity,
                day,
                product_price: price,
                charge,
                productsId: orderProductsId,
                rest
            }
        });
        setDataSource(res);
        setLoading(false);
    }
    const handleSelectAll = () => {
        calculateItems(productsData);
       const total = productsData.map((data, index) => index);
       setSelectedRowKeys(total);
       const rowId = productsData.map(({orderProductsId})=> orderProductsId);
       setselectedIds(rowId);
    }
    useEffect(() => {
        tableData()        
        handleSelectAll();
    }, [productsData]);
  
    return (
        <Modal
            destroyOnClose={true}
            open={showPickupModal}
            style={{
                top: -20
            }}
            title={<>
                <Title level={4}>Pick up {items} items</Title>
                <Text>Select items that are going out</Text>
            </>}
            onCancel={() => setShowPickupModal(false)}
            footer={[
                <Button size='large' onClick={() => setShowPickupModal(false)}>Cancel</Button>,
                selectedRowKeys.length > 0 ?
                    <Button
                        loading={pickupLoading}
                        icon={<FaLevelUpAlt />} type='primary' danger size='large' onClick={()=>handlepickUp(selectedId, 'Picked up')}>
                        Pick up {items} items
                    </Button>
                    :
                    <Button
                        icon={<FaLevelUpAlt />} size='large'>
                        No items to pick up
                    </Button>
            ]}
        >
            <div>
                <div className='pickup_head'>
                    {
                        selectedRowKeys.length < dataSource.length &&
                        <p onClick={handleSelectAll}>Select all</p>
                    }
                    {
                        selectedRowKeys.length > 0 &&
                        <p onClick={() => { setSelectedRowKeys([]); setItems(0) }}>
                            Clear selection
                        </p>
                    }
                </div>
                <Table
                    loading={loading}
                    className='pickupModalTable'
                    size='small'
                    bordered={false}
                    rowSelection={rowSelection}
                    dataSource={dataSource}
                    showHeader={false}
                    pagination={false}
                >
                    {
                        columns.map(({ title, dataIndex, render }, index) => <Column
                            key={index}
                            title={title}
                            dataIndex={dataIndex}
                            className="pickupTableTd"
                            render={render}
                        />)
                    }
                </Table>
            </div>
        </Modal>
    );
};

export default memo(PickupModal);