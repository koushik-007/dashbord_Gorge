import React, { useContext, useState, useEffect } from 'react';
import { Col, Row, Input, Button, Form, Skeleton, Result, Select } from 'antd';
import { TagOutlined, ArrowLeftOutlined, LockFilled } from "@ant-design/icons";
import { RentalPeriodProvider } from '../../context/RentalPeriodContext';
import { Title } from '../CartPopover/CartHelpers';
import "./Checkout.css";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShopCartProvder } from '../../context/ShopCartContext';
import { collection } from 'firebase/firestore';
import { addDocumentData, db, getAllData } from '../../Firebasefunctions/db';
import Variants from '../Variants/Variants';

const { Search } = Input;
const { Option } = Select;

const Checkout = () => {
    let navigate = useNavigate();
    const location = useLocation();
    const [rentalPeriod, setRentalPeriod] = useContext(RentalPeriodProvider);
    const [cartData, setCartData] = useContext(ShopCartProvder);
    const [subTotal, setSubTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isSucess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [form] = Form.useForm();
    const orderCollectionRef = collection(db, "orders_collections");
    const customersCollectionsRef = collection(db, "customers_collections");

    const onFinish = async (values) => {
        try {
            if (cartData.length === 0) {
                return setIsFailed(true)
            }
            setLoading(true);
            await Object.keys(values).forEach(key => values[key] === '' ? delete values[key] : {});
            const customerRes = await addDocumentData(customersCollectionsRef, values);
            const allOrder = await getAllData(orderCollectionRef);
            const orderData = {
                ...rentalPeriod,
                customerId: customerRes.id,
                name: values['name'],
                email: values['email'],
                orderNumber: parseFloat(allOrder.length) + 1,
                status: 'Reserved',
                amount: 0,
                secuirityDeposit: 0
            }
            const res = await addDocumentData(orderCollectionRef, orderData);
            if (res.id) {
                const orderedProductsRef = collection(db, "orders_collections", res.id, "products");
                cartData.forEach(async (obj) => {
                    const { productId, variationId, productCount, price, product_name, imageUrl } = obj;
                    await addDocumentData(orderedProductsRef, { product_name, imageUrl, productId, variationId, quantity: productCount, dayCount: rentalPeriod?.dayCount, charge: rentalPeriod?.dayCount * price, status: 'Reserved', });
                })
                setIsSuccess(true);
            }
            const sendmail = await fetch("https://email-server-nivs.onrender.com/sendMail", {
                method: "POST",
                body: JSON.stringify({
                    from: rentalPeriod?.rentalPeriod[0],
                    till: rentalPeriod?.rentalPeriod[1],
                    link: `https://poetic-maamoul-0c8e53.netlify.app/orders/${res.id}`
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            const resy = sendmail.json();
            
                // .then(response => response.json())
                // .then(json => console.log(json));
            setLoading(false);
        } catch (error) {
            setIsSuccess(false)
            setLoading(false);
        }
    };

    useEffect(() => {
        const amounts = cartData.map(data => data.productCount * parseFloat(data.price) * rentalPeriod.dayCount);
        var sub = amounts.reduce((a, b) => a + b, 0);
        setSubTotal(sub);
    }, [cartData]);

    const handleBackToShop = () => {
        navigate('/shop');
        if (isSucess) {
            setCartData([]);
            setRentalPeriod({
                rentalPeriod: [],
                dayCount: 1
            });
        }
    }
    if (cartData.length === 0) {
        return <Navigate to="/shop" state={{ from: location }} replace />
    }
    return (
        <Row>
            <Col lg={10} span={24} className='checkout_details'>
                <div className="checkout_rental_dates">
                    <Title rentalPeriod={rentalPeriod?.rentalPeriod} showCross={false} />
                </div>
                {
                    cartData.map(({ product_name, imageUrl, productCount, key, price, id, stock, pickedUp, variationId, productId, taxProfile, ...rest }) => {
                        return (

                            <div className="checkout_products" key={key}>
                                <div className="checkout_products_details">
                                    <span>
                                        {imageUrl ? <img src={imageUrl} alt='' /> : <Skeleton.Image active={false} />}
                                    </span>
                                    <span style={{ marginLeft: '13px' }}>{productCount}x</span>
                                    <span>{product_name} - <Variants data={rest} dot={true} /></span>
                                    <span>{price * productCount * rentalPeriod.dayCount}</span>
                                </div>
                            </div>
                        )
                    })
                }
                <hr />
                <div className="checkout_summery">
                    <span>Subtotal</span>
                    <span>{subTotal}</span>
                </div>
                <div className="checkout_coupon">
                    <Search size='large' placeholder="Coupon code " enterButton={<span><TagOutlined /> Apply</span>} />
                </div>
                <hr />
                <div className="checkout_summery">
                    <span>Total</span>
                    <span>{subTotal}</span>
                </div>
                <div className="checkout_back_btn">
                    <Button onClick={handleBackToShop} icon={<ArrowLeftOutlined />} size='large' type='text' block>Back to website</Button>
                </div>
            </Col>

            <Col lg={14} span={24} className="checkout_form">
                {
                    isSucess ?
                        <div className="checkout_success">
                            <Result
                                status="success"
                                title="Order completed"
                                subTitle="Thank you for your order"
                                extra={[
                                    <div className="checkout_back_btn" key={5}>
                                        <Button onClick={handleBackToShop} icon={<ArrowLeftOutlined />} size='large' type='text'>Back to website</Button>
                                    </div>,
                                ]}
                            />
                        </div>
                        :
                        null
                }
                {
                    isFailed ?
                        <div className="checkout_success">
                            <Result
                                status="warning"
                                title="Could not complete the order"
                                extra={[
                                    <div className="checkout_back_btn" key={5}>
                                        <Button onClick={handleBackToShop} icon={<ArrowLeftOutlined />} size='large' type='text'>Back to website</Button>
                                    </div>,
                                ]}
                            />
                        </div>
                        :
                        null
                }
                <Form
                    onFinish={onFinish}
                    //autoComplete="off"
                    initialValues={{
                        city: '',
                        region: '',
                        address_2: '',
                    }}
                    form={form}
                    layout="vertical"
                    name="form_in_modal">
                    <Row justify='space-between' gutter={[24, 0]}>
                        <Col xl={12} span={24}>
                            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]} >
                                <Input size='large' />
                            </Form.Item>
                        </Col>
                        <Col xl={12} span={24}>
                            <Form.Item label="Email" name="email" rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]} >
                                <Input size='large' />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Customer type" name="customerType" rules={[
                                {
                                    required: true,
                                    message: 'Please select your type!',
                                },
                            ]}>
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    className="checkout_select"
                                    size='large'
                                    placeholder="individual"
                                >
                                    <Option value="individual">Individual</Option>
                                    <Option value="company">Company</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <h2>Address</h2>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Address line 1" name="address" rules={[{ required: true, message: 'Please input your address!' }]} >
                                <Input size='large' />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Address line 2" name="address_2" >
                                <Input size='large' />
                            </Form.Item>
                        </Col>
                        <Col lg={10} xl={6} span={24}>
                            <Form.Item label="Zip" name="zipCode" rules={[{ required: true, message: 'Please input your zip!' }]} >
                                <Input size='large' />
                            </Form.Item>
                        </Col>
                        <Col lg={14} xl={10} span={24}>
                            <Form.Item label="City" name="city" >
                                <Input size='large' />
                            </Form.Item>
                        </Col>
                        <Col lg={24} xl={8} span={24}>
                            <Form.Item label="State/Province/Region" name="region" >
                                <Input size='large' />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <hr />
                        </Col>
                        <Col span={24}>
                            <Form.Item>
                                <Button loading={loading} icon={<LockFilled />} size='large' type="primary" htmlType="submit" block>Complete checkout</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    );
};

export default Checkout;