import React, { Suspense, lazy } from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
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
import Authentication from './pages/Authentication/Authentication';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import AuthContext from './context/AuthContext';
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const ShopCart = lazy(() => import('./pages/Shop/ShopCart'));

function App() {
  return (
    <AuthContext>
      <AllOrderDataContext>
        <PriceContext>
          <ShopCartContext>
            <RentalPeriodContext>
              <VariationDataContext>
                <CartWarningContext>
                  <BrowserRouter>
                    <Suspense fallback={<Spin className='fallback' indicator={<LoadingOutlined spin />} />}>
                      <Routes>
                        <Route exact path="/dashboard/*" element={
                          <PrivateRoute>
                            <Dashboard />
                          </PrivateRoute>} />
                        <Route exact path="/auth" element={<Authentication />} />
                        <Route exact path="/shop/*" element={<ShopCart />} />
                        <Route
                          path="*"
                          element={<Navigate to="/shop" replace />}
                        />
                      </Routes>
                    </Suspense>
                  </BrowserRouter>
                </CartWarningContext>
              </VariationDataContext>
            </RentalPeriodContext>
          </ShopCartContext>
        </PriceContext>
      </AllOrderDataContext>
    </AuthContext>
  );
}

export default App;
