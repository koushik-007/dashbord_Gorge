import React, { useState, useEffect } from 'react';
import { Button, Col, Layout, Row, Skeleton, Table, Typography } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import QRCode from "react-qr-code";
import Header from "../Header";
import "./PackingSlip.css";
import { useParams } from 'react-router-dom';
import { collection, doc } from 'firebase/firestore';
import { db, getAData, getAllData } from '../../Firebasefunctions/db';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import Variants from '../Variants/Variants';
import ReactToPrint from 'react-to-print';

const { Content } = Layout;
const { Title } = Typography;

const columns = [
    {
        title: 'Qty',
        dataIndex: 'quantity',
        width: 80,
    },
    {
        title: 'Name',
        dataIndex: 'product_name',
        render: (name, record) => {
            const { product_name, quantity, imageUrl, pickedUp, price, stock, key, ...rest } = record;
            return <div className='packing_slip_table_image'>
                <div> {imageUrl ? <img src={imageUrl} alt="product" /> : <Skeleton.Image active={false} />}</div>
                <div>
                    {name} - <Variants data={rest} />
                </div>
            </div>
        }
    },
];


const PackingSlip = () => {
    const { orderId } = useParams();
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState({});
    const [productsData, setProductsData] = useState([]);
    const orderRef = doc(db, "orders_collections", orderId);
    const orderProductRef = collection(db, "orders_collections", orderId, "products");

    const getOrderData = async () => {
        setLoading(true)
        const data = await getAData(orderRef);
        setOrderData(data);
        const orderProducts = await getAllData(orderProductRef);
        orderProducts.forEach(async (obj) => {
            const { quantity, imageUrl, key } = obj;
            const varaition = doc(db, "product_collections", obj.productId, "variations", obj.variationId);
            const varaitionData = await getAData(varaition);
            setProductsData((curr) => ([...curr, { ...varaitionData, imageUrl, quantity, key }]));
        });
        setLoading(false);
    }
    useEffect(() => {
        getOrderData();
    }, [orderId]);
    const componentRef = React.useRef(null);
    const reactToPrintTrigger = React.useCallback(() => {
        return (
            <Button disabled={loading} icon={<PrinterOutlined />} size="large">Print/Download</Button>
        );
    }, []);
    const reactToPrintContent = React.useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

   

    if (Object.keys(orderData).length > 0) {
        return <>
            <Header>
                <div className='order-header'>
                    <div>
                        <Title>Order {'#' + orderData?.orderNumber} </Title>
                    </div>
                    <div>
                        <ReactToPrint
                            trigger={reactToPrintTrigger}
                            content={reactToPrintContent}
                        />
                        {/* <Button disabled={loading} onClick={printDocument} icon={<DownloadOutlined />} size="large">
                            Download
                        </Button> */}
                    </div>
                </div>
            </Header>
            <Content className='main_content'>
                <Row>
                    <Col span={18} offset={2} className='slip'>
                        <div id='divToPrint' className="content" ref={componentRef}>
                            <Row align="start" className='content-row'>
                                <Col span={12}>
                                    <div className='qr_code'>
                                        <QRCode
                                            size={256}
                                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                            value={'https://poetic-maamoul-0c8e53.netlify.app/shop'}
                                            viewBox={`0 0 256 256`}
                                        />
                                    </div>
                                    <br />
                                    <h3>{orderData?.name}</h3>
                                    <div>{orderData?.email}</div>
                                </Col>
                                <Col span={12}>
                                    <div id="company-info">
                                        <strong className="company-name">our_company</strong>
                                        <br /><span>Country Name<br /></span>
                                        <span className="company-phone">+21321561260</span><br />
                                        <span className="company-email">kawsarmollik03@gmail.com</span>
                                        <br /><br />
                                        <span className="financial-line-1"></span>
                                        <br />
                                        <span className="financial-line-2">
                                        </span>
                                    </div>
                                </Col>
                                <br />
                                <Col span={17}>
                                    <div className='packing_date'>
                                        <h2>Packing slip</h2>
                                        <div className="dates">
                                            <span className="number">
                                                <b>Order</b>
                                                <span>{'#' + orderData?.orderNumber}</span>
                                            </span>
                                            <span className="starts-at">
                                                <b>Pickup</b>
                                                <span>{Object.keys(orderData).length > 0 ? orderData?.rentalPeriod[0] : ''}</span>
                                            </span>
                                            <span className="stops-at">
                                                <b>Return</b>
                                                <span>{Object.keys(orderData).length > 0 ? orderData?.rentalPeriod[1] : ''}</span>
                                            </span>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <br />
                                    <Table
                                        loading={loading}
                                        pagination={false}
                                        dataSource={productsData}
                                        columns={columns}
                                    />
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Content>
        </>
    }
    return (
        <div className="order-edit-loading">
            <CustomSpinner />
        </div>
    )
};

export default PackingSlip;