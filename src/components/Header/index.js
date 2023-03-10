import React from 'react';
import { Layout } from 'antd';
import "./header.css"

const { Header } = Layout;

const index = ({ children }) => {
  return (
    <Header className='header_content'>{ children }</Header>
  );
};

export default index;