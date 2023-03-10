import React from 'react';
import { Layout } from 'antd';
import "./DashboardLayout.css"
import Sidebar from '../../components/Sidebar/Sidebar';


const DashboardLayout = ({ children }) => (
  <Layout hasSider>
    <Sidebar />
    <Layout
      className="site-layout"
    >
      {
        children
      }
    </Layout>
  </Layout>
);

export default DashboardLayout;