import React, { useState, useEffect } from 'react';
import { Button, Col, Skeleton } from 'antd';
import { ShoppingCartOutlined } from "@ant-design/icons"
import CartModal from '../../components/CartModal/Bundle';
import { collection } from 'firebase/firestore';
import { db, getAllData } from '../../Firebasefunctions/db';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';

const Bundles = ({ data, dayCount, rentalPeriod }) => {
    const { imageUrl, id, bundleName, stock } = data;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const bundles_collections = collection(db, "bundles_collections", id, "product_collections");

    const [total, setToal] = useState(0);
    const getData = async () => {
        setLoading(true)
        const allProducts = await getAllData(bundles_collections);
        allProducts.forEach(obj => {
            obj.productId = id;
        })
        setToal(data?.price)
        setProducts(allProducts);
        setLoading(false)
    }
    useEffect(() => {
        getData();
    }, []);
    if (loading) {
        <Col sm={12} xl={8} span={24} >
            <div style={{ marginTop: '5rem' }}>
                <CustomSpinner />
            </div>
        </Col>
    }

    return (<>
        <Col sm={12} xl={8} span={24} >
            <div className="product-card-wrapper" onClick={() => { setIsModalVisible(true) }}>
                <div className="product-card-wrapper-inner">
                    <span><div className='card-img'>
                        {
                            imageUrl ?
                                <img src={imageUrl} alt='' />
                                :
                                <Skeleton.Image size={555} active={false} />
                        }
                    </div>
                        <div className="card-details">
                            {rentalPeriod.length === 2 ? <span className='card_availablity'> {stock} available</span> : null}
                            <div>
                                <b>{bundleName}</b>
                                <br />
                                <span>
                                    <span>{rentalPeriod.length === 2 ? dayCount + (dayCount > 1 ? " days" : ' day') : 'from'}</span> &nbsp;
                                    <b>{total * dayCount}</b>
                                </span>
                            </div>
                            <Button type='primary' size='large' icon={<ShoppingCartOutlined />} />
                        </div></span>
                </div>
            </div>
            <CartModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                selectedProduct={data}
                dayCount={dayCount}
                price={total}
                rentalPeriod={rentalPeriod}
                productOfBundles={products}
            />
        </Col>
    </>
    );
};

export default Bundles;