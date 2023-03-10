import React, { createContext, useState } from 'react';

export const VariationDataProvider = createContext();
const VariationDataContext = ({children}) => {
    const [data, setData] = useState([]);
    return <VariationDataProvider.Provider value={[data, setData] } >{children}</VariationDataProvider.Provider>
};

export default VariationDataContext;