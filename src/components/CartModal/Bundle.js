import React, { useEffect, useState } from 'react';
import { Button, InputNumber, Modal, Select, Skeleton } from 'antd';
import { useContext } from 'react';
import { ShopCartProvder } from '../../context/ShopCartContext';
import "./CartModal.css";

const { Option } = Select;

const Bundle = ({ isModalVisible, setIsModalVisible, selectedProduct, dayCount, rentalPeriod, productOfBundles, price }) => {
    const { bundleName, imageUrl } = selectedProduct;
    const [cartData, setCartData] = useContext(ShopCartProvder);

    const [isAddToCartloading, setIsAddToCartLoading] = useState(false);
    const [productCount, setProductCount] = useState(1);
  
    const handleAddToCart = (bundle) => {
        setIsAddToCartLoading(true);
        const newData = [...cartData];
        const index = newData.findIndex(({ key }) => key === bundle.key);
        if (index === -1) {
            const newcart = [...cartData, { ...bundle, productCount, price, isBundle: true }];
            setCartData(newcart);
        }
        else {
            const item = newData[index];
            let count = item.productCount + productCount;
            newData.splice(index, 1, { ...item, productCount: count, isBundle: true  });
            setCartData(newData);
        }
        setIsModalVisible(false)
        setIsAddToCartLoading(false);
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
                    <h3>{bundleName}</h3>
                    {
                        productOfBundles.map(({ product_name, key, id, quantity }) => (
                           <div className='bundleProducts'>
                            <div className='quantity'>
                            {quantity}x
                            </div>
                             <Select
                                name="variation"
                                defaultValue={product_name}
                                size='large'                                
                            >                              
                                <Option key={key} value={id}>
                                    {product_name}
                                </Option>
                            </Select>
                           </div> 
                        ))
                    }
                    <div className='cart_price'>
                        <span>{rentalPeriod.length === 2 ? dayCount + (dayCount > 1 ? " days" : ' day') : 'from'}</span>
                        <br />
                        <span>{ price * dayCount}</span>
                    </div>
                    <div className='cart_add_btn'>
                        <InputNumber size='large' value={productCount} onChange={(value) => setProductCount(value)} />
                        <Button loading={isAddToCartloading} onClick={() => handleAddToCart(selectedProduct)} size='large' type='primary' >Add to cart</Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Bundle;