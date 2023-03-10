import React, { createContext, useState }from 'react';

export const PriceContextProvider = createContext();
const PriceContext = ({children}) => {
    const [price, setPrice] = useState(0);
    const value = {price, setPrice}
    return <PriceContextProvider.Provider value={value} >{children}</PriceContextProvider.Provider>
};

export default PriceContext;