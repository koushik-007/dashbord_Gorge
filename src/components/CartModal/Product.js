import React, { useEffect, useState } from 'react';
import { Button, InputNumber, Modal, Select, Skeleton } from 'antd';
import { useContext } from 'react';
import { ShopCartProvder } from '../../context/ShopCartContext';

const { Option } = Select;

const CartModal = ({ isModalVisible, setIsModalVisible, selectedProduct, dayCount, rentalPeriod, variationData }) => {
    const { product_name, price_per, price, imageUrl } = selectedProduct;

    const [cartData, setCartData] = useContext(ShopCartProvder);
    
    const [isAddToCartloading, setIsAddToCartLoading] = useState(false);
    const [productCount, setProductCount] = useState(1);
    const [variationId, setVariationId] = useState('')
    useEffect(()=>{
        setVariationId(variationData[0]?.id)
    }, [variationData])
    const handleAddToCart = (product) => {        
        setIsAddToCartLoading(true);
        const newData = [...cartData];
        const index = newData.findIndex(({ key }) => key === product.key);
        if (index === -1) {
            const newcart = [...cartData, { ...product, product_name, imageUrl, productCount, variationId: product.id }];
            setCartData(newcart);           
        }
        else {
            const item = newData[index];
            let count = item.productCount + productCount;
            newData.splice(index, 1, { ...item, productCount: count });
            setCartData(newData);            
        }
        setIsModalVisible(false)
        setIsAddToCartLoading(false);
    }

    const variantsDestruct = (obj) => {
        const { id, key, price, stock, pickedUp, productId, product_name, ...rest } = obj;
        const variants = Object.keys(rest);
        return variants.map((item) => rest[item])
    }
    return (
        <Modal
            destroyOnClose={true}
            wrapClassName='productNbundlesModal'
            open={isModalVisible}
            onCancel={() => { setIsModalVisible(false); setProductCount(1) }}
            footer={null}
        >
            <div className="cart_modal_wrapper">
                <div className="cart_modal_inner">
                    <div className="cart_img_box">
                        <div>
                            {
                                imageUrl ?
                                    <img src={imageUrl} alt='' />
                                    :
                                    <Skeleton.Image size={555} active={false} />
                            }
                        </div>
                    </div>
                </div>
                <div className="cart_content">
                    <h3>{product_name}</h3>
                    <Select
                        name="variation"
                        defaultValue={variationData[0]?.id ? variationData[0].id : 'all' }
                        size='large'
                        onChange={(value)=> setVariationId(value)}
                    >
                        {
                            variationData.map((obj) => {
                                const { id, key, stock } = obj;
                                const values = variantsDestruct(obj);
                                return (
                                    <Option key={key} value={id}>
                                        {values.map((value, index) => (<span key={index}>{ values.length > index && index > 0 ? ',' : null} {value} </span>))}
                                        {rentalPeriod.length === 2 ? `(${stock} available)` : null}
                                    </Option>
                                )
                            })
                        }
                    </Select>
                    <div className='cart_price'>
                        <span>{rentalPeriod.length === 2 ? dayCount + (dayCount > 1 ? " days" : ' day') : 'from'}</span>
                        <br />
                        <span>{price * dayCount}</span>
                    </div>
                    <div className='cart_add_btn'>
                        <InputNumber size='large' value={productCount} onChange={(value) => setProductCount(value)} />
                        <Button loading={isAddToCartloading} onClick={() => handleAddToCart(variationData.find(( data)=> data.id === variationId))} size='large' type='primary' >Add to cart</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CartModal;