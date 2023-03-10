import React, { createContext, useState }from 'react';

export const AllOrderDataProvder = createContext();
const AllOrderDataContext = ({children}) => {
    const [data, setData] = useState([]);
    return <AllOrderDataProvder.Provider value={[data, setData] } >{children}</AllOrderDataProvder.Provider>
};

export default AllOrderDataContext;