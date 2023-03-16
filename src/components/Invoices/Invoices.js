import React, { useState, useEffect } from 'react';
import { Button, Col, Layout, Row, Skeleton, Table, Typography } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { collection, doc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db, getAData, getAllData } from '../../Firebasefunctions/db';
import Header from "../Header";
import ReactToPrint from 'react-to-print';
import Variants from '../Variants/Variants';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import moment from 'moment';

const { Content } = Layout;
const { Title } = Typography;
const columns = [
    {
        title: '',
        dataIndex: 'quantity',
        width: 80,
        render: (quantity) => (
            <span>{quantity}x</span>
        )
    },
    {
        title: '',
        dataIndex: 'product',
        width: 400
    },
    {
        title: '',
        dataIndex: 'dayCount',
        render: (dayCount) => (dayCount > 0 ? dayCount + ' days' : 1 + ' day')
    },
    {
        title: 'Price',
        dataIndex: 'price',
        render: (price, record) => (price * record.dayCount)
    },
    {
        title: 'Total',
        dataIndex: 'total',
        render: (_, record) => (record.price * record.dayCount * record.quantity)
    }
];
const Invoices = () => {
    const { orderId } = useParams();
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState({});
    const [productsData, setProductsData] = useState([]);
    const [bundlesData, setBundleData] = useState([]);
    const orderRef = doc(db, "orders_collections", orderId);
    const orderProductRef = collection(db, "orders_collections", orderId, "products");
    const orderBundleRef = collection(db, "orders_collections", orderId, "bundles");

    const getOrderData = async () => {
        setLoading(true)
        const data = await getAData(orderRef);
        const { rentalPeriod } = data;
        setOrderData(data);
        const diff = moment(rentalPeriod[1]).diff(moment(rentalPeriod[0]), 'days')
        const orderProducts = await getAllData(orderProductRef);
        orderProducts.forEach(async (obj) => {
            const { quantity, imageUrl, key } = obj;
            const varaition = doc(db, "product_collections", obj.productId, "variations", obj.variationId);
            const varaitionData = await getAData(varaition);
            const { product_name, pickedUp, price, stock, dayCount, ...rest } = varaitionData;
            setProductsData((curr) => ([...curr,
            {
                quantity,
                key,
                dayCount: diff,
                price,
                product: <div className='packing_slip_table_image'>
                    <div> {imageUrl ? <img src={imageUrl} alt="product" /> : <Skeleton.Image active={false} />}</div>
                    <div>
                        {product_name} - <Variants data={rest} />
                    </div>
                </div>

            }]));
        })
        const orderBundles = await getAllData(orderBundleRef);
        orderBundles.forEach(async (item) => {
            const { bundleId, quantity, key } = item;
            const bundleDocRef = doc(db, "bundles_collections", bundleId);
            const bundleData = await getAData(bundleDocRef);
            const { bundleName, price, imageUrl } = bundleData;
            setBundleData((curr) => ([...curr,
            {
                quantity,
                key,
                dayCount: diff,
                price,
                product: <div className='packing_slip_table_image'>
                    <div> {imageUrl ? <img src={imageUrl} alt="product" /> : <Skeleton.Image active={false} />}</div>
                    <div>
                        {bundleName}
                    </div>
                </div>

            }
            ]));
        })

        setLoading(false);
    }
    useEffect(() => {
        getOrderData();
    }, []);
    const componentRef = React.useRef(null);
    const reactToPrintTrigger = React.useCallback(() => {
        return (
            <Button disabled={loading} icon={<PrinterOutlined />} size="large">Print/Download</Button>
        );
    }, []);
    const reactToPrintContent = React.useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    let outstanding = orderData?.price - (orderData?.amount + orderData?.secuirityDeposit);

    if (Object.keys(orderData).length > 0) {
        return <>
            <Header>
                <div className='order-header'>
                    <div>
                        <Title>Order {'#' + orderData?.orderNumber} {`>`} <strong>Invoice</strong> </Title>
                    </div>
                    <div>
                        <ReactToPrint
                            trigger={reactToPrintTrigger}
                            content={reactToPrintContent}
                        />
                    </div>
                </div>
            </Header>
            <Content className='main_content'>
                <Row>
                    <Col span={18} offset={2} className='slip'>
                        <div id='divToPrint' className="content" ref={componentRef}>
                            <Row align="start" className='content-row'>
                                <Col span={15}>
                                    <h3>{orderData?.name}</h3>
                                    <div>{orderData?.email}</div>
                                </Col>
                                <Col span={6} >
                                    <div id="company-info" style={{ marginLeft: '1.4rem' }}>
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
                                <Col span={20}>
                                    <div className='packing_date'>
                                        <h2>Invoice</h2>
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
                                    {
                                        productsData.length > 0 &&
                                        <Table
                                        loading={loading}
                                        pagination={false}
                                        dataSource={productsData}
                                        columns={columns}
                                    />
                                    }
                                    {
                                        bundlesData.length > 0 ?
                                            <Table
                                                showHeader={productsData.length === 0}
                                                loading={loading}
                                                pagination={false}
                                                dataSource={bundlesData}
                                                columns={columns}
                                            />
                                            :
                                            null
                                    }
                                </Col>
                                <Col span={6} offset={17}>
                                    <div className="calculation-box">
                                        <div className="calculation-details">Subtotal</div>
                                        <div className="calculation-details">{orderData?.price}</div>
                                    </div>
                                </Col>
                                <Col span={9} offset={15}>
                                    <hr />
                                </Col>
                                <Col span={6} offset={17}>
                                    <div className="calculation-box">
                                        <div className="calculation-details">
                                            <b>Total incl. taxes</b>
                                        </div>
                                        <div className="calculation-details">
                                            <b>{orderData?.price}</b>
                                        </div>
                                        <div className="calculation-details">Security deposit</div>
                                        <div className="calculation-details">{orderData?.secuirityDeposit?.toFixed(2)}</div>
                                    </div>
                                </Col>
                                <Col span={9} offset={15}>
                                    <hr />
                                </Col>
                                <Col span={6} offset={17}>
                                    <div className="calculation-box">
                                        <div className="calculation-details">Paid</div>
                                        <div className="calculation-details">{orderData?.amount ? orderData?.amount : 0.00}</div>
                                        <div className="calculation-details"><b>Outstanding</b></div>
                                        <div className="calculation-details"><b>{outstanding.toFixed(2)}</b></div>
                                    </div>
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

export default Invoices;