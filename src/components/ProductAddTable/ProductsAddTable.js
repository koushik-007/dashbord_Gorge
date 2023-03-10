import React, { useState, memo, useMemo } from 'react';
import { Button, Form, InputNumber, Table } from 'antd';
import { PlusOutlined, MinusOutlined, CloseOutlined } from '@ant-design/icons';
import { columns, EditableCell } from './TableHelper';
import { ChargeColumn } from './Columns';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebasefunctions/db';
import "./ProductDetails.css";
// import { arrayMoveImmutable } from 'array-move';
// import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const { Column } = Table;

const ProductAddTable = ({ productsData, setProductsData, handleDeleteProduct, loadingProductTable, orderId, pickupNReturnDate }) => {
    // const SortableItem = SortableElement((props) => <tr {...props} />);
    // const SortableBody = SortableContainer((props) => <tbody {...props} />);
    // const onSortEnd = ({ oldIndex, newIndex }) => {
    //     if (oldIndex !== newIndex) {
    //         const newData = arrayMoveImmutable(productsData.slice(), oldIndex, newIndex).filter(
    //             (el) => !!el,
    //         );
    //         console.log('Sorted items: ', newData);
    //         setProductsData(newData);
    //     }
    // };

    // const DraggableContainer = (props) => (
    //     <SortableBody
    //         useDragHandle
    //         disableAutoscroll
    //         helperclassname="row-dragging"
    //         onSortEnd={onSortEnd}
    //         {...props}
    //     />
    // );

    // const DraggableBodyRow = ({ className, style, ...restProps }) => {
    //     const index = productsData.findIndex((x) => x.index === restProps['data-row-key']);
    //     return <SortableItem key={index} index={index} {...restProps} />;
    // };

    
    const dataSourceLocal = useMemo(() => {
        const localReload = productsData.map((data, index) => {
            const { product_name, imageUrl, price, id, quantity, charge, orderProductsId, dayCount, status,stock, ...rest } = data;
            return {
                key: index,
                imgage: imageUrl,
                product_details: product_name,
                quantity,
                dayCount,
                product_price: price,
                charge,
                productsId: id,
                pickupNReturnDate,
                status,
                orderProductsId,
                stock,
                rest
            }
        });
        return localReload;
    }, [productsData, pickupNReturnDate])


    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [customChargesLoading, setCustomChargesLoading] = useState(false)
    const isEditing = ((record) => record.key === editingKey);
    const edit = (record) => {
        form.setFieldsValue(record);
        setEditingKey(record.key);
    };

    const handleProductUpdates = async (id, data) => {
        const productDocRef = doc(db, "orders_collections", orderId, "products", id);
        await updateDoc(productDocRef, data);
    };
    const handleCustomCharges = async (key) => {
        try {
            setCustomChargesLoading(true);
            const row = await form.validateFields();
            const newData = [...productsData];
            const index = newData.findIndex((item) => key === item.orderProductsId);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setProductsData(newData);
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
        const newData = [...productsData];
        const index = newData.findIndex((item) => key === item.orderProductsId);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, dayCount: day, charge: day * price });
            setProductsData(newData);
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
        const newData = [...productsData];
        const index = newData.findIndex((item) => key === item.orderProductsId);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, quantity: value });
            setProductsData(newData);
            if (orderId) {
                await handleProductUpdates(key, { quantity: value })
            }
        }
    }
    
    return (
        <Form form={form} component={false}>
            <Table
                loading={loadingProductTable}
                pagination={false}
                dataSource={dataSourceLocal}
                rowKey="index"
                scroll={{ x: 1000 }}
                components={{
                    body: {
                        //wrapper: DraggableContainer,
                        //row: DraggableBodyRow,
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
                    render={(quantity, record) => {
                        return <span key={record.key} className="quantityInput">
                            <InputNumber
                                min={1}
                                size='large'
                                disabled={record.status === "returned" || record.status === "Picked up" || record.stock - record.rest.pickedUp === 0}
                                defaultValue={quantity}
                                onChange={(value) => handleQuantity(value, record.orderProductsId)}
                                controls={{ upIcon: <PlusOutlined />, downIcon: <MinusOutlined /> }}
                            />
                        </span>
                    }}
                />
                <Column
                    title="Charge"
                    key="charge"
                    dataIndex="charge"
                    width={150}
                    className='drag-visible'
                    render={(charge, record) => {
                        return <ChargeColumn key={record.key} handleCharges={handleCharges} record={record} charge={charge} edit={edit} />
                    }}
                    onCell={
                        (record) => ({
                            handleCustomCharges,
                            setEditingKey,
                            record,
                            dataIndex: 'charge',
                            title: 'charge',
                            editing: isEditing(record),
                            loading: customChargesLoading
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
                         onClick={() => handleDeleteProduct(record)} icon={<CloseOutlined />} 
                         disabled={record.status === "returned" || record.status === "Picked up"}
                         />
                    }}
                />
            </Table>
        </Form>
    );
};

export default memo(ProductAddTable);