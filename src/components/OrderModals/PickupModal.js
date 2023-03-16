import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, InputNumber, Modal, Skeleton, Table, Typography } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { FaLevelUpAlt } from "react-icons/fa"
import './PickupModal.css';
import Variants from '../Variants/Variants';
import ProductShortageModal from './ProductShortageModal';
import { doc, updateDoc } from 'firebase/firestore';
import { db, getAData } from '../../Firebasefunctions/db';

const { Title, Text } = Typography;
const { Column } = Table;

const columns = [
    {
        title: '',
        dataIndex: 'image',
        width: 50,
        render: (imgUrl, record) => (
            <div className='productImageDiv'>
                {imgUrl ? <img src={imgUrl} alt="product" /> : <Skeleton.Image active={false} />}
                <span>{record.product_details} {
                    record.isBundle ? '' :
                        <>
                            - &nbsp; <Variants data={record.rest} />
                        </>}</span>
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
const PickupModal = ({ showPickupModal, setShowPickupModal, productsData, bundleData, orderId, setBundleData, setProductsData, getOrderData, setLoadingProductTable, isReturn=false, isNewOrder=false, handlepickUpNew, pkLoading }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [items, setItems] = useState(0);
    const [bundleSelectedRowKeys, setBundleSelectedRowKeys] = useState([]);
    const [bundleItems, setBundleItems] = useState(0);    
    const [pickupLoading, setPickupLoading] = useState(false);
    const [selectedId, setselectedIds] = useState([]);
    const [bundleSelectedId, setBundleSelectedIds] = useState([]);
    const [shortageProducts, setShortageProducts] = useState([])
    const [isOpenShortageModal, seIsOpenShortageModal] = useState(false);
    const calculateItems = (data, setState) => {
        const quantity = data.map(data => parseFloat(data.quantity));
        let total = quantity.reduce((a, b) => a + b, 0);
        setState(total);
    }
    const onSelectChange = useCallback((newSelectedRowKeys, selectedRows) => {
        calculateItems(selectedRows, setItems);
        setSelectedRowKeys(newSelectedRowKeys);
        const rowId = selectedRows.map(({ productsId }) => productsId);
        setselectedIds(rowId);
    }, []);
    const onSelectChangeBundle = useCallback((newSelectedRowKeys, selectedRows) => {
        calculateItems(selectedRows, setBundleItems);
        setBundleSelectedRowKeys(newSelectedRowKeys);
        const rowId = selectedRows.map(({ bundlesId }) => bundlesId);
        setBundleSelectedIds(rowId);
    }, []);

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const rowSelectionBundle = {
        selectedRowKeys: bundleSelectedRowKeys,
        onChange: onSelectChangeBundle,
    };

   async function handlepickUp(selectedIds, bundleSelectedIds, stat) {
        let isShortage = []
        selectedIds.forEach((id) => {
            const data = productsData.find(data => data.orderProductsId === id);
            if (data?.stock - data?.quantity < 0) {
                isShortage.push({ ...data, isBundle: false });
            }
        });
        bundleSelectedIds.forEach((id) => {
            const data = bundleData.find(data => data.orderBundleId === id);
            if (data?.stock - data?.quantity < 0) {
                isShortage.push({ ...data, isBundle: true });
            }
        });
        if (isShortage.length > 0) {
            setShortageProducts(isShortage);
            return seIsOpenShortageModal(true);
        }
        else {
            setPickupLoading(true);
            for (let i = 0; i < productsData.length; i++) {
                const { orderProductsId, variationId, productId, quantity } = productsData[i];
                const productDocRef = doc(db, "orders_collections", orderId, "products", orderProductsId);
                if (selectedIds.includes(orderProductsId)) {
                    await updateDoc(productDocRef, { status: stat })
                    if (stat === "Picked up") {
                        const variationDoc = doc(db, "product_collections", productId, 'variations', variationId);
                        const data = await getAData(variationDoc);
                        let picked = parseFloat(data?.pickedUp) + parseFloat(quantity);
                        let returned = parseFloat(data?.pickedUp) - parseFloat(quantity)
                        await updateDoc(variationDoc, { pickedUp: isReturn ? returned : picked  });
                    }                    
                }
            }
            for (let i = 0; i < bundleData.length; i++) {
                const { orderBundleId, bundleId, quantity } = bundleData[i];
                const bundleDocRef = doc(db, "orders_collections", orderId, "bundles", orderBundleId);
                if (bundleSelectedIds.includes(orderBundleId)) {                    
                    await updateDoc(bundleDocRef, { status: stat })
                    if (stat === "Picked up") {
                        const bundleDoc = doc(db, "bundles_collections", bundleId);
                        const data = await getAData(bundleDoc);
                        let picked = parseFloat(data?.pickedUp) + parseFloat(quantity);
                        let returned = parseFloat(data?.pickedUp) - parseFloat(quantity)
                        await updateDoc(bundleDoc, { pickedUp: isReturn ? returned : picked });
                    }                    
                }
            }
            setLoadingProductTable(true);
            setProductsData([]);
            setBundleData([]);
            getOrderData();
            setLoadingProductTable(false);
            setPickupLoading(false);
            setShowPickupModal(false);
        }
    }

    const dataSource = useMemo(() => {
        const res = productsData.map((data, index) => {
            const { product_name, imageUrl, price, id, quantity, day, charge, dayCount, status, stock, orderProductsId, productId, key, variationId, pickedUp, ...rest } = data;
            return {
                index: index,
                key: index,
                image: imageUrl,
                product_details: product_name,
                quantity,
                day,
                product_price: price,
                charge,
                productsId: orderProductsId,
                rest
            }
        });
        return res;
    }, [productsData]);
    const bundledataSource = useMemo(() => {
        const res = bundleData.map((data, index) => {
            const { bundleName, imageUrl, quantity, orderBundleId } = data;
            return {
                index: index,
                key: index,
                image: imageUrl,
                product_details: bundleName,
                quantity,
                isBundle: true,
                bundlesId: orderBundleId
            }
        });
        return res;
    }, [bundleData]);

    const handleSelectAll = () => {
        calculateItems(productsData, setItems);
        const total = productsData.map((data, index) => index);
        setSelectedRowKeys(total);
        const rowId = productsData.map(({ orderProductsId }) => orderProductsId);
        setselectedIds(rowId);
    }
    const handleSelectAllBundle = () => {
        calculateItems(bundleData, setBundleItems);
        const total = bundleData.map((data, index) => index);
        setBundleSelectedRowKeys(total);
        const rowId = bundleData.map(({ orderBundleId }) => orderBundleId);
        setBundleSelectedIds(rowId);
    }
    useEffect(() => {
        handleSelectAll();
    }, [productsData]);
    useEffect(() => {
        handleSelectAllBundle();
    }, [bundleData]);
    return (
        <>
            <Modal
                destroyOnClose={true}
                open={showPickupModal}
                style={{
                    top: -20
                }}
                title={<>
                    <Title level={4}>{isReturn ? 'Return' : 'Pick up'} {items + bundleItems} items</Title>
                    <Text>Select items that are going out</Text>
                </>}
                onCancel={() => setShowPickupModal(false)}
                footer={[
                    <Button size='large' onClick={() => setShowPickupModal(false)}>Cancel</Button>,
                    selectedRowKeys.length > 0 || bundleSelectedRowKeys.length > 0 ?
                        isNewOrder ?
                        <Button
                            loading={pkLoading}
                            icon={<FaLevelUpAlt />} type='primary' danger size='large' onClick={() => handlepickUpNew(selectedId, bundleSelectedId, 'Picked up')}>
                            Pick up {items + bundleItems} items
                        </Button>
                        :
                        <Button
                            loading={pickupLoading}
                            icon={<FaLevelUpAlt />} type='primary' danger size='large' onClick={() => handlepickUp(selectedId, bundleSelectedId, isReturn ? 'returned' : 'Picked up')}>
                            {isReturn ? 'Return' : 'Pick up'} {items + bundleItems} items
                        </Button>
                        :
                        <Button
                            icon={<FaLevelUpAlt />} size='large'>
                            {
                                isReturn ? 
                                'No items to returned'
                                :
                                'No items to pick up'
                            }
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
                    {
                        productsData.length > 0 &&
                        <Table
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
                    }
                    {
                        bundleData.length > 0 &&
                        <Table
                            className='pickupModalTable'
                            size='small'
                            bordered={false}
                            rowSelection={rowSelectionBundle}
                            dataSource={bundledataSource}
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
                    }
                </div>
            </Modal>
            <ProductShortageModal
                isOpenShortageModalBundle={false}
                isShowModal={isOpenShortageModal}
                setIsShowModal={seIsOpenShortageModal}
                dataSource={shortageProducts}
            />
        </>
    );
};

export default memo(PickupModal);