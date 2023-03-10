import React, { createContext, useState } from 'react';

export const RentalPeriodProvider = createContext();
const RentalPeriodContext = ({children}) => {
    const [rentalPeriod, setRentalPeriod] = useState({
        rentalPeriod: [],
        dayCount: 1
    });
    return <RentalPeriodProvider.Provider value={[rentalPeriod, setRentalPeriod] } >{children}</RentalPeriodProvider.Provider>
};

export default RentalPeriodContext;