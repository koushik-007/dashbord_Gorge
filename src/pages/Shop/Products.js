import React, { useState, useEffect } from 'react';
import { Button, Col, Skeleton } from 'antd';
import { ShoppingCartOutlined } from "@ant-design/icons"
import CartModal from '../../components/CartModal/Product';
import { collection } from 'firebase/firestore';
import { db, getAllData } from '../../Firebasefunctions/db';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';

const Products = ({ data, dayCount, rentalPeriod, }) => {
    const { product_name, price_per, price, imageUrl, id } = data;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [variationData, setVariationData] = useState([]);
    const variationCollection = collection(db, "product_collections", id, 'variations');
    const [total, setToal] = useState(0);
    const getData = async () => {
        setLoading(true)
        const variations = await getAllData(variationCollection);
        variations.forEach(obj => {
            obj.productId = id;
        })
        const charges = variations.map(data => parseFloat(data.stock));
        var total = charges.reduce((a, b) => a + b, 0);
        setToal(total);
        setVariationData(variations);
        setLoading(false)
    }
    useEffect(() => {
        getData()
    }, [data]);
    if (loading) {
        return <Col sm={12} xl={8} span={24} >
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
                            {rentalPeriod.length === 2 ? <span className='card_availablity'> {total} available</span> : null}
                            <div>
                                <b>{product_name}</b>
                                <br />
                                <span>
                                    <span>{rentalPeriod.length === 2 ? dayCount + (dayCount > 1 ? " days" : ' day') : 'from'}</span> &nbsp;
                                    <b>{variationData[0]?.price * dayCount}</b>
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
                rentalPeriod={rentalPeriod}
                variationData={variationData}
            />
        </Col>
    </>
    );
};

export default Products;