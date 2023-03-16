import React from 'react';
import { Button, Form, InputNumber, Table } from 'antd';
import { PlusOutlined, MinusOutlined, CloseOutlined } from "@ant-design/icons";
import { useMemo } from 'react';
import { columns } from './Tablehelper';
import { ChargeColumn } from '../ProductAddTable/Columns';
import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebasefunctions/db';
import { EditableCell } from '../ProductAddTable/TableHelper';

const { Column } = Table;

const BundleAddTable = ({loadingBundleTable, bundleData, pickupNReturnDate, handleDeleteBundle, setBundleData, orderId, showHeader}) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [customChargesLoading, setCustomChargesLoading] = useState(false)
    const isEditing = ((record) => record.key === editingKey);
    const edit = (record) => {
        form.setFieldsValue(record);
        setEditingKey(record.key);
    };
    const dataSourceLocal = useMemo(() => {
        const localReload = bundleData.map((data, index) => {
            const { bundleName, imageUrl, price, bundleId, quantity, charge, orderBundleId, dayCount, status,stock, ...rest } = data;
            return {
                key: index,
                image: imageUrl,
                bundleName,
                quantity,
                dayCount,
                price,
                charge,
                bundleId,
                pickupNReturnDate,
                status,
                orderBundleId,
                stock,
                rest
            }
        });
        return localReload;
    }, [bundleData, pickupNReturnDate]);
    const handleProductUpdates = async (id, data) => {
        const productDocRef = doc(db, "orders_collections", orderId, "bundles", id);
        await updateDoc(productDocRef, data);
    };
    const handleCustomCharges = async (key) => {
        try {
            setCustomChargesLoading(true);
            const row = await form.validateFields();
            const newData = [...bundleData];
            const index = newData.findIndex((item) => key === item.orderBundleId);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setBundleData(newData);
                if (orderId) {
                    await handleProductUpdates(key, row)
                }
                setEditingKey('');
            }
            setCustomChargesLoading(false);
        } catch (errInfo) {
            setCustomChargesLoading(false);
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleCharges = async (day, key, price) => {
        const newData = [...bundleData];
        const index = newData.findIndex((item) => key === item.orderBundleId);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, dayCount: day, charge: day * price });
            setBundleData(newData);
            setEditingKey('');
            if (orderId) {
                await handleProductUpdates(key, { dayCount: day, charge: day * price })
            }
        }
    }
    const handleQuantity = async (value, key) => {        
        if (value < 1) {
            return;
        }
        const newData = [...bundleData];
        const index = newData.findIndex((item) => key === item.orderBundleId);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, quantity: value });
            setBundleData(newData);
            if (orderId) {
                await handleProductUpdates(key, { quantity: value })
            }
        }
    }
    return (
        <Form form={form} component={false}>
            <Table
                showHeader={showHeader}
                loading={loadingBundleTable}
                pagination={false}
                dataSource={dataSourceLocal}
                rowKey="index"
                scroll={{ x: 1000 }}
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
            >
                {
                    columns.map(({ title, dataIndex, className, width, render }, index) => <Column
                        title={title}
                        dataIndex={dataIndex}
                        key={index}
                        className={className}
                        width={width}
                        render={render}
                    />)
                }
                <Column
                    title="Quantity"
                    key="quantity"
                    dataIndex="quantity"
                    width={60}
                    className='drag-visible'
                    onCell={
                        (record) => ({
                            handleQuantity,
                            quantity: record.quantity,
                            dataIndex: "quantity",
                            record,
                            requireId: record.orderBundleId
                        })
                    }  
                />
                <Column
                    title="Charge"
                    key="charge"
                    dataIndex="charge"
                    width={150}
                    className='drag-visible'
                    render={(charge, record) => {
                        return <ChargeColumn key={record.key} handleCharges={handleCharges} record={record} charge={charge} requireId={record.orderBundleId} price={record.price} edit={edit} />
                    }}
                    onCell={
                        (record) => ({
                            handleCustomCharges,
                            setEditingKey,
                            record,
                            dataIndex: 'charge',
                            title: 'charge',
                            editing: isEditing(record),
                            loading: customChargesLoading,
                            requireId: record.orderBundleId
                        })
                    }
                />
                <Column
                    title={''}
                    key="total"
                    dataIndex="total"
                    className='drag-visible'
                    width={60}
                    render={(_, record) => {
                        return <b key={record.key}>{record.quantity * record.charge}</b>
                    }}
                />
                <Column
                    title={''}
                    key="delete"
                    dataIndex="delete"
                    className='drag-visible'
                    width={60}
                    render={(_, record) => {
                        return <Button
                        key={record.key}
                         danger 
                         onClick={() => handleDeleteBundle(record)} icon={<CloseOutlined />} 
                         disabled={record.status === "returned" || record.status === "Picked up"}
                         />
                    }}
                />
            </Table>
        </Form>
    );
};

export default BundleAddTable;