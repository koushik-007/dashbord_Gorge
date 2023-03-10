import React, { Suspense, lazy } from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import 'antd/dist/antd.css';
import AllOrderDataContext from './context/AllOrderDataContext';
import PriceContext from './context/PriceContext';
import ShopCartContext from './context/ShopCartContext';
import RentalPeriodContext from './context/RentalPeriodContext';
import { Spin } from 'antd';
import { LoadingOutlined } from "@ant-design/icons";
import VariationDataContext from './context/VariationDataContext';
import CartWarningContext from './context/CartWarningContext';
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const ShopCart = lazy(() => import('./pages/Shop/ShopCart'));

function App() {
  return (
    <AllOrderDataContext>
      <PriceContext>
        <ShopCartContext>
          <RentalPeriodContext>
            <VariationDataContext>
              <CartWarningContext>
                <BrowserRouter>
                  <Suspense fallback={<Spin className='fallback' indicator={<LoadingOutlined spin />} />}>
                    <Routes>
                      <Route exact path="/*" element={<Dashboard />} />
                      <Route exact path="/shop/*" element={<ShopCart />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </CartWarningContext>
            </VariationDataContext>
          </RentalPeriodContext>
        </ShopCartContext>
      </PriceContext>
    </AllOrderDataContext>
  );
}

export default App;
