import React, { createContext, useState } from 'react';

export const ShopCartProvder = createContext();
const ShopCartContext = ({children}) => {
    const [cartData, setCartData] = useState([]);
    return <ShopCartProvder.Provider value={[cartData, setCartData]} >{children}</ShopCartProvder.Provider>
};

export default ShopCartContext;