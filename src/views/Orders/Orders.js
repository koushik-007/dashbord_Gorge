import React from 'react';
import Header from '../../components/Header';
import { Button, Col, Input, Row, Typography, Layout, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Orders.css'
import AllOrders from './AllOrders/AllOrders';

const { Content, } = Layout;
const { Title } = Typography;

const Orders = () => {
    let navigate = useNavigate();
    return (
        <>
            <Header>
                <Row>
                    <Col span={12} sm={20} md={16} lg={12}>
                        <Row>
                            <Col sm={11} md={12} lg={8}>
                                <Title>Orders</Title>
                            </Col>
                            <Col sm={8} md={12} lg={12}>
                                <Input size="large" placeholder="Search" style={{ borderRadius: '7px' }} prefix={<SearchOutlined className='searchIcon' />} />
                            </Col>
                        </Row>
                    </Col>
                    <Col className='addBtn' sm={4} md={8} lg={12}>
                        <div>
                            <Button
                                onClick={() => { navigate("/orders/new") }}
                                type="primary"
                                size='large'
                            >
                                Add order
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Header>
            <Content className='content_design main_content'>
                <Tabs defaultActiveKey="1" items={[
                    { label: "ALL", key: '1', children:  <AllOrders/> },
                    { label: "Upcoming", key: '2', children: <h1>abc</h1> },
                    { label: "Late", key: '3', children: <h1>abc</h1>},
                    { label: "With shortage", key: '4', children: <h1>abc</h1>},
                ]}>                    
                </Tabs>
            </Content>
        </>
    );
};

export default Orders;