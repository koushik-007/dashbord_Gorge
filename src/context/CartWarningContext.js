import React, { createContext, useState }from 'react';

export const CartWarningContextProvider = createContext();
const CartWarningContext = ({children}) => {
    const [cartWarning, setCartWarning] = useState(false);
    return <CartWarningContextProvider.Provider value={[cartWarning, setCartWarning]} >{children}</CartWarningContextProvider.Provider>
};

export default CartWarningContext;