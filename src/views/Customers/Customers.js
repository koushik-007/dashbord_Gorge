import { useEffect, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Header from '../../components/Header';
import Menu from "../../components/Menu"
import { Input, Row, Col, Typography, Layout, Button, Table, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import "./Customers.css";
import { collection } from 'firebase/firestore';
import { db, getAllData } from '../../Firebasefunctions/db';
import { columns, items } from './tableHelper';

const { Title } = Typography;
const { Content, } = Layout;

const Customers = () => {
    let navigate = useNavigate();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false);

    const customersCollectionsRef = collection(db, "customers_collections");

    useEffect(() => {
        setLoading(true);
        const getData = async () => {
            const data = await getAllData(customersCollectionsRef);
            setData(data);
            setLoading(false);
        }
        getData();
    }, []);
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };


    const handleSelectAll = () => {
        data.map(({ key }) => setSelectedRowKeys((curr) => [key, ...curr]))
    }

    return (
        <>
            <Header>
                <Row>
                    <Col span={12} sm={20} md={16} lg={12}>
                        <Row>
                            <Col sm={11} md={12} lg={8}>
                                <Title>Customers</Title>
                            </Col>
                            <Col sm={8} md={12} lg={12}>
                                <Input size="large" placeholder="Search" style={{ borderRadius: '7px' }} prefix={<SearchOutlined className='searchIcon' />} />
                            </Col>
                        </Row>
                    </Col>
                    <Col className='addBtn' sm={4} md={8} lg={12}>
                        <div>
                            <Button
                                onClick={() => { navigate("/customers/new") }}
                                type="primary"
                                size='large'
                            >
                                Add customer
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Header>
            <Content className='main_content'>
                {
                    loading ?
                        <div className="example">
                            <Spin />
                        </div>
                        :
                        data.length === 0 ?

                            <div className='addCustomer'>
                                <h1>Add your first customer </h1>
                                <h2>Register customer information in your workspace so you can easily view their past orders or add them to new orders instantly.</h2>
                            </div>
                            :

                            <div>
                                <div className='head_table'>
                                    <Menu items={items} disabled={!selectedRowKeys.length > 0} type="text" />
                                    <p
                                    >
                                        {selectedRowKeys.length} products selected
                                    </p>
                                    {
                                        selectedRowKeys.length === 0 ? <p onClick={handleSelectAll}>Select all {data.length} products</p> : <p onClick={() => setSelectedRowKeys([])}>
                                            Clear selection
                                        </p>
                                    }

                                </div>
                                <Table
                                    className='customerTable'
                                    size='middle'
                                    loading={loading}
                                    rowSelection={rowSelection}
                                    columns={columns}
                                    dataSource={data}
                                    onRow={(record, rowIndex) => {
                                        return {
                                            onClick: event => navigate(`/customers/details/${record.key}/edit`)
                                        };
                                    }
                                    }
                                />
                            </div>
                }
            </Content>
        </>
    );
};

export default Customers;