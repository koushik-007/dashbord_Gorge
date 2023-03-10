import React from 'react';
import Header from '../../../components/Header'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Tabs, Layout,Breadcrumb, Row, Col } from 'antd';
import Variations from '../../../components/Variations/Variations';
import { useEffect } from 'react';
import { collection, doc } from 'firebase/firestore';
import { db, getAData, getAllData } from '../../../Firebasefunctions/db';
import { useState } from 'react';
import Inventory from '../../../components/Inventory/Inventory';
import ProductPricing from '../../../components/ProductPricing/ProductPricing';
import ProductSettings from '../../../components/ProductSettings/ProductSettings';
import './ProductsDetails.css'
import CustomSpinner from '../../../components/CustomSpinner/CustomSpinner';

const { Content } = Layout;

const ProductsDetails = () => {
    const { pathname } = useLocation();
    let navigate = useNavigate();
    const params = useParams();
    const { id } = params;
    const [product, setProduct] = useState({});
    const [data, setData] = useState([]);

    const productDocRef = doc(db, "product_collections", id);
    const variationCollection = collection(db, "product_collections", id, 'variations');
    const getData = async () => {
        const product = await getAData(productDocRef);
        setProduct(product)
        const variations = await getAllData(variationCollection);
        setData(variations);
    }
    useEffect(() => {
        getData()
    }, []);

    if (Object.keys(product).length > 0 && data.length > 0) {
        return (
            <>
                <Header>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
                        <Breadcrumb.Item>{product?.product_name ? product?.product_name : 'Details'}</Breadcrumb.Item>
                    </Breadcrumb>
                </Header>
                <Content className='main_content'>
                    <Tabs
                        defaultActiveKey={pathname}
                        activeKey={pathname}
                        onChange={(key) => navigate(key)}
                        items={[
                            { label: 'Inventory', key: `/products/details/${id}/inventory`, children: <Inventory tracking_method={product?.tracking_method} productName={product?.product_name} imageUrl={product.imageUrl} data={data} setData={setData} productId={id} /> },
                            { label: 'Variations', key: `/products/details/${id}/variations`, children: <Variations product_name={product?.product_name} tracking_method={product?.tracking_method} productId={id} imageUrl={product.imageUrl} price={parseFloat(product.price)} data={data} setData={setData} /> },
                            { label: 'Pricing', key: `/products/details/${id}/pricing`, children: <ProductPricing totalVariation={data.length} product={product} productId={id} setProduct={setProduct} /> },
                            { label: 'Settings', key: `/products/details/${id}/settings`, children: <ProductSettings product={product} productId={id} setProduct={setProduct} /> },
                            { label: 'History', key: `/products/details/${id}/history`, children: <div>history</div> },
                        ]} />
                </Content>
            </>
        );
    }
    return <Row justify="space-around" align="middle" style={{ height: '100vh' }}>
    <Col>
        <CustomSpinner />
    </Col>
</Row>
};

export default ProductsDetails;