import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { createContext, useEffect, useState }from 'react';
import { db } from '../Firebasefunctions/db';

export const AllOrderDataProvder = createContext();
const AllOrderDataContext = ({children}) => {
    const [data, setData] = useState([]);
    const ordersCollectionsRef = collection(db, "orders_collections");
    useEffect(() => {
        const getData = async () => {
            try {
                const q = query(ordersCollectionsRef, orderBy("orderNumber", 'desc'));                
                onSnapshot(q, (querySnapshot) => {
                    const data = querySnapshot.docs.map((doc) => ({key: doc.id,...doc.data()}));
                    setData(data);
                })
                
            } catch (error) {
                setData([])
                console.log(error);
            }
        }
        getData();
    }, []);
    return <AllOrderDataProvder.Provider value={[data, setData] } >{children}</AllOrderDataProvder.Provider>
};

export default AllOrderDataContext;