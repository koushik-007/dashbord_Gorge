import React from 'react';
import { useLocation } from 'react-router-dom';
import CartPopover from '../../components/CartPopover/CartPopover';

const ShopCartLayout = ({ children }) => {
    const { pathname } = useLocation();
    return (
        <div className='wrapper'>
            <div className="products" id="header">
                <div className="shop-container">
                    <div id="logo">
                        <span>test_four</span>
                    </div>
                    {
                        pathname === '/shop/checkout' ?
                            null
                            :
                            <div className="cart-button">
                                <CartPopover />
                            </div>}
                </div>
            </div>
            <div className="gray">
                <div className="shop-container">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ShopCartLayout;