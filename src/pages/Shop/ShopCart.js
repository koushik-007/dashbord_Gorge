import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ShopCartLayout from '../../Layout/ShopCartLayout/ShopCartLayout';

import { routes } from './routes';

const ShopCart = () => {
    
    return (
        <ShopCartLayout>
            <Routes>
            {
                routes.map(({path, component}, index)=><Route key={index} path={path} element={component} />)
            }
            </Routes>
        </ShopCartLayout>
    );
};

export default ShopCart;