import React from 'react';
import Header from '../../components/Header';
import { Button, Col, Input, Row, Typography, Layout, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Orders.css'
import AllOrders from './AllOrders/AllOrders';

const { Content, } = Layout;
const { Title } = Typography;

const Orders = () => {
    let navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    let activeKey = searchParams.get('filters') ? searchParams.get('filters') : 'all'
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
                <Tabs 
                defaultActiveKey={activeKey}
                activeKey={activeKey}
                onChange={(key) => key === 'all' ? setSearchParams({}) : setSearchParams({filters: key})}
                 items={[
                    { label: "ALL", key: 'all', children:  <AllOrders activeKey={activeKey}/> },
                    { label: "Upcoming", key: 'upcoming', children: <AllOrders activeKey={activeKey}/> },
                    { label: "Late", key: 'late', children: <AllOrders activeKey={activeKey}/>},
                    { label: "Archived", key: 'archived', children: <AllOrders activeKey={activeKey}/>},
                ]}>                    
                </Tabs>
            </Content>
        </>
    );
};

export default Orders;