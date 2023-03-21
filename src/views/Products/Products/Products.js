import { useState } from 'react';
import { SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import Header from '../../../components/Header';
import './Products.css'
import { Input, Row, Col, Typography, Layout, Tabs, Dropdown, Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { items } from './Menu';
import ProductsTable from '../ProductsTable/ProductsTable';
import BundlesTable from '../BundlesTable/BundlesTable';

const { Title } = Typography;
const { Content, } = Layout;

const Products = () => {
    const { pathname } = useLocation();
    let navigate = useNavigate();

    const [isUpSideArrow, setIsUpSideArrow] = useState(false);

    return (
        <>
            <Header>
                <Row>
                    <Col span={12} sm={20} md={16} lg={12}>
                        <Row>
                            <Col span={8}>
                                <Title style={{ textTransform: "capitalize" }}>{pathname.split('/')[2]}</Title>
                            </Col>
                            <Col span={10}>
                                <Input size="large" placeholder="Search" style={{ borderRadius: '7px' }} prefix={<SearchOutlined className='searchIcon' />} />
                            </Col>
                        </Row>
                    </Col>
                    <Col className='addBtn' sm={4} md={8} lg={12}>
                        <div>
                            <Dropdown.Button
                                overlayClassName='productBundleDropdown'
                                onOpenChange={isVisible => setIsUpSideArrow(isVisible)}
                                icon={isUpSideArrow ? <UpOutlined style={{ fontSize: '15px' }} /> : <DownOutlined style={{ fontSize: '15px' }} />}
                                menu={{
                                    items: items.map(({ label, icon, link }, index) => ({
                                        key: index,
                                        label: <Link to={link}>{label}</Link>,
                                        icon: icon
                                    }))
                                }}
                                onClick={() => { navigate('new') }}
                                trigger={['click']}
                                type="primary"
                                size='large'
                            >
                                Add {pathname.split('/')[2]}
                            </Dropdown.Button>
                        </div>
                    </Col>
                </Row>
            </Header>
            <Content className='main_content'>
                <Tabs defaultActiveKey="products" activeKey={pathname.split('/')[2]} onChange={(key) => navigate(`/dashboard/${key}`)}
                    items={[
                        { label: "Products", key: "products", children: <ProductsTable /> },
                        { label: "Bundles", key: "bundles", children: <BundlesTable /> },
                    ]} />
            </Content>
        </>
    );
};

export default Products;