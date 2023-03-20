import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContextProvider } from '../../context/AuthContext';
import CustomSpinner from '../CustomSpinner/CustomSpinner';

function PrivateRoute({ children }) {
    const { isAuthenticated, user, isAuthLoading} = useContext(AuthContextProvider);
    const location = useLocation();
    if (isAuthLoading) {
        return <CustomSpinner />
    }
    if (!isAuthenticated || !user?.uid) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
}

export default PrivateRoute;