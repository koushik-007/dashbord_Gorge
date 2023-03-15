import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Tabs, Layout, Breadcrumb, Row, Col } from 'antd';
import BundlesContent from '../../../components/BundlesContent/BundlesContent';
import { doc } from 'firebase/firestore';
import { db, getAData } from '../../../Firebasefunctions/db';
import BundlesPricing from '../../../components/BundlesPricing/BundlesPricing';
import BundlesSettings from '../../../components/BundlesSettings/BundlesSettings';
import CustomSpinner from '../../../components/CustomSpinner/CustomSpinner';

const { Content } = Layout;

const BundlesDetails = () => {
    const { pathname } = useLocation();
    let navigate = useNavigate();
    const params = useParams();
    const { id } = params;
    const [bundleData, setBundleData] = useState({});

    useEffect(() => {
        const getData = async () => {
            const bundlesDocRef = doc(db, "bundles_collections", id);
            const bundle = await getAData(bundlesDocRef);
            setBundleData(bundle);
        }
        getData();
    }, [id]);
    if (Object.keys(bundleData).length === 0) {
        return <Row justify="space-around" align="middle" style={{ height: '100vh' }}>
            <Col>
                <CustomSpinner />
            </Col>
        </Row>
    }
    return (
        <>
            <Header>
                <Breadcrumb separator=">">
                    <Breadcrumb.Item href="/bundles">Bundles</Breadcrumb.Item>
                    <Breadcrumb.Item>{bundleData?.bundleName ? bundleData?.bundleName : 'Details'}</Breadcrumb.Item>
                </Breadcrumb>
            </Header>
            <Content className='main_content'>
                <Tabs
                    defaultActiveKey={pathname}
                    activeKey={pathname}
                    onChange={(key) => navigate(key)}
                    items={[
                        { label: "Contents", key: `/bundles/details/${id}/content`, children: <BundlesContent BundlesId={id} bundleData={bundleData} /> },
                        { label: "Pricing", key: `/bundles/details/${id}/pricing`, children: <BundlesPricing bundleData={bundleData} BundlesId={id} /> },
                        { label: "Settings", key: `/bundles/details/${id}/settings`, children: <BundlesSettings bundleData={bundleData} BundlesId={id} setBundleData={setBundleData} /> },
                    ]}>
                </Tabs>
            </Content>
        </>
    );
};

export default BundlesDetails;