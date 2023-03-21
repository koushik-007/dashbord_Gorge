import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../../Layout/DashboardLayout/DashboardLayout';

import { routes } from './routes';

const Dashboard = () => {
    return (
        <DashboardLayout>
            <Routes>
                {
                    routes.map(({ path, component }, index) => <Route exact key={index} path={path} element={component} />)
                }
                <Route
                    path="documents"
                    element={<Navigate to="invoices" replace />}
                />                
            </Routes>

        </DashboardLayout>
    );
};

export default Dashboard;