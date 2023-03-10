import React, { useState, useEffect } from 'react';
import { Button, Popover } from 'antd';
import { ShoppingCartOutlined, WarningFilled } from "@ant-design/icons";
import "./CartPopover.css";
import { Content, Title } from './CartHelpers';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ShopCartProvder } from '../../context/ShopCartContext';
import { RentalPeriodProvider } from '../../context/RentalPeriodContext';
import { CartWarningContextProvider } from '../../context/CartWarningContext';


const CartPopover = () => {

    const [cartData, setCartData] = useContext(ShopCartProvder);
    const [rentalPeriod, setRentalPeriod] = useContext(RentalPeriodProvider);
    const [cartWarning, setCartWarning] = useContext(CartWarningContextProvider);
    const { dayCount } = rentalPeriod;
    const [totalProductCount, setToalProductCount] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [isOpen, setisOpen] = useState(false);
    
    const handleRemoveCart = (selectedkey) => {
        const newcart = cartData.filter(({ key }) => !(key === selectedkey));
        setCartData(newcart);
    }

    useEffect(() => {
        const product = cartData.map(data => parseFloat(data.productCount));
        var productCount = product.reduce((a, b) => a + b, 0);
        setToalProductCount(productCount);
        const amounts = cartData.map(data => data.productCount * parseFloat(data.price) * dayCount);
        var sub = amounts.reduce((a, b) => a + b, 0);
        setSubTotal(sub);
        const stockOverflow = cartData.filter(({stock, productCount}) => stock < productCount);
        if (stockOverflow.length > 0) {
            setCartWarning(true)
        }
        if (stockOverflow.length === 0) {
            setCartWarning(false)
        }
    }, [cartData]);

    const handleProductCount = (seletedkey, value) => {
        if (value === 0) {
            return handleRemoveCart(seletedkey);
        }
        const newData = [...cartData];
        const index = newData.findIndex(({ key }) => key === seletedkey);
        if (index > -1) {
            const item = newData[index];            
            newData.splice(index, 1, { ...item, productCount: value });
            setCartData(newData);            
        }
    }
    return (
        <>
            <Popover
                open={isOpen}
                overlayStyle={{ position: 'fixed' }}
                overlayClassName='cart_popover'
                placement="bottomRight"
                title={<Title set={setisOpen} rentalPeriod={rentalPeriod?.rentalPeriod} />}
                content={
                    cartData.length > 0 ?
                        <>
                            <div className='cart_product_list'>
                                {
                                    cartWarning ? <div className='cart_warning'>
                                        <WarningFilled />
                                        <span>
                                            Not all products are available during the selected period
                                        </span>
                                    </div>
                                        :
                                        null
                                }
                                {
                                    cartData.map((data) => (<Content rentalPeriod={rentalPeriod?.rentalPeriod} data={{ ...data, dayCount }} handleProductCount={handleProductCount} handleRemoveCart={handleRemoveCart} key={data.key} />))
                                }
                            </div>
                            <div className="product_list_summery">
                                <div className="summery_detail">
                                    <span>Subtotal</span>
                                    <span>{subTotal.toFixed(2)}</span>
                                </div>
                                <div className="summery_button_group">
                                    <Link to="/shop/cart-details"><Button onClick={() => setisOpen(false)} size="large" type="primary" block>View cart</Button></Link>
                                    <Link to="/shop/checkout"><Button size="large" type="primary" block disabled={rentalPeriod?.rentalPeriod.length === 0 || cartWarning}>Checkout</Button></Link>
                                </div>
                            </div>
                        </>
                        :
                        <div className="cart_pop_content">
                            <p>Your cart is empty</p>
                            <Link to={'/shop'}><p onClick={() => setisOpen(false)} >CONTINUE SHOPPING</p></Link>
                        </div>
                }
                trigger="click"
                onOpenChange={(open) => setisOpen(open)}
                destroyTooltipOnHide={{ keepParent: false }}
            >
                {
                    cartData.length > 0 && <span className='cart_count'>{totalProductCount}</span>
                }
                <Button onClick={() => setisOpen(true)} type='text' icon={<ShoppingCartOutlined />} />
            </Popover>
        </>
    );
};

export default CartPopover;