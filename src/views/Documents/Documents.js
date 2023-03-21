import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Input, Layout, Row, Space, Table, Tabs, Typography } from 'antd';
import Header from '../../components/Header';
import { SearchOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../Firebasefunctions/db';

const { Title } = Typography;
const { Content } = Layout;
const { Column } = Table;
const columns = [
    {
        title: 'Order',
        dataIndex: 'orderNumber',
        width: 80,
    },
    {
        title: 'Customer',
        dataIndex: 'name',
        width: 470,
    },
    {
        title: 'Date',
        dataIndex: 'date',
    },
    {
        title: 'Price',
        dataIndex: 'price',
        width: 200,
    },
];
const Documents = () => {
    const { pathname } = useLocation();
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [paid, setPaid] = useState(0);
    const [turnOver, setturnOver] = useState(0);
    const ordersCollectionsRef = collection(db, "orders_collections");
    useEffect(() => {
        setLoading(true);
        const getData = async () => {
            try {
                const q = query(ordersCollectionsRef, where("status", '!=', 'Canceled'), orderBy("status"), orderBy("orderNumber", 'desc'));
                const querySnapshot = await getDocs(q);
                
                const data = querySnapshot.docs.map((doc, index) => {
                    const { name, firstName, lastName, orderNumber, price, amount, secuirityDeposit, registerPaymentDate } = doc.data();
                    return {
                        key: doc.id,
                        orderNumber: <span>#{orderNumber} </span>,
                        name: <span><div className="avatar">
                            {
                                name &&
                                <div>
                                    {firstName ? firstName[0] + lastName && lastName[0] : name.charAt(0).toUpperCase()}
                                </div>
                            }
                            <b>{name && name}</b>
                        </div>
                        </span>,
                        price,
                        amount,
                        secuirityDeposit: secuirityDeposit ? secuirityDeposit : 0,
                        date: registerPaymentDate
                    }
                });
                const charges = data.map(data => parseFloat(data.amount));
                var total = charges.reduce((a, b) => a + b, 0);
                setPaid(total);
                const charges2 = data.map(data => parseFloat(data.price));
                var total2 = charges2.reduce((a, b) => a + b, 0);
                setturnOver(total2);
                setData(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
        getData();
    }, []);
    return (
        <>
            <Header>
                <Row>
                    <Col span={12} sm={20} md={16} lg={12}>
                        <Row>
                            <Col sm={11} md={12} lg={8}>
                                <Title>Invoices</Title>
                            </Col>
                            <Col sm={8} md={12} lg={12}>
                                <Input size="large" placeholder="Search" style={{ borderRadius: '7px' }} prefix={<SearchOutlined className='searchIcon' />} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Header>
            <Content className='content_design main_content'>
                <Tabs
                    defaultActiveKey="1"
                    activeKey={pathname}
                    onChange={(key) => navigate(key)}
                    items={[
                        {
                            label: "Invoices", key: '/dashboard/documents/invoices', children: <>
                                <Row gutter={[24, 24]}>
                                    <Col span={6}>
                                        <Card style={{ height: '120px' }}>
                                            <h3>Nr. of invoices</h3>
                                            <h2>{data?.length}</h2>
                                        </Card>
                                    </Col>
                                    <Col span={6}>
                                        <Card style={{ height: '120px' }}>
                                            <h3>Paid amount</h3>
                                            <h2>{paid}</h2>
                                        </Card>
                                    </Col>
                                    <Col span={6}>
                                        <Card style={{ height: '120px' }}>
                                            <h3>To be paid</h3>
                                        <h2>{turnOver-paid}</h2>
                                        </Card>
                                    </Col>
                                    <Col span={6}>
                                        <Card style={{ height: '120px' }}>
                                            <h3>Turnover</h3>
                                            <h2>{turnOver}</h2>
                                        </Card>
                                    </Col>
                                </Row>
                                <br/>
                                <Table
                                    className='ordertable'
                                    size='middle'
                                    bordered
                                    loading={loading}
                                    dataSource={data}
                                    scroll={{
                                        x: 1100,
                                        y: 400
                                    }}
                                    onRow={(record, rowIndex) => ({ onClick: event => navigate(`invoices/${record.key}`) })}
                                >
                                    {
                                        columns.map(({ title, dataIndex, render, width, sorter }) => <Column
                                            key={dataIndex}
                                            title={title}
                                            dataIndex={dataIndex}
                                            render={render}
                                            width={width}
                                            sorter={sorter}
                                        />)
                                    }
                                    <Column
                                        title='Payment Status'
                                        dataIndex='paymentStatus'
                                        className='paymentStatus'
                                        width={220}
                                        render={(_, record) => {
                                            const { price, amount } = record
                                            let outstanding = price - amount;
                                            return <div className={outstanding === 0 ? 'paid' : outstanding === price ? 'overpaid' : 'due'}>
                                                <Button style={{ textAlign: 'center' }} type='primary' size='large' shape='round'>
                                                    {
                                                        outstanding === 0 ? 'Paid' : outstanding === price ? 'Payment due' : 'partially paid'
                                                    }
                                                </Button>
                                            </div>
                                        }}
                                    />
                                </Table>
                            </>
                        },
                        // { label: "Contracts", key: '/documents/contracts', children: <h1>abc</h1> },
                    ]}>
                </Tabs>
            </Content>
        </>
    );
};

export default Documents;