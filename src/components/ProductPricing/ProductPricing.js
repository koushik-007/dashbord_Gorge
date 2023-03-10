import React, { useState } from 'react';
import { Button, Checkbox, Col, Form, Input, InputNumber, message, Radio, Row, Select, Space } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import "./ProductPricing.css";
import { Link } from 'react-router-dom';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { db, getAllData } from '../../Firebasefunctions/db';

const { Option } = Select;

const ProductPricing = ({ totalVariation, product, productId }) => {
    const [value, setValue] = useState(product?.pricing_method);
    const [isDisabled, setIsDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    
    const productDocRef = doc(db, "product_collections", productId);
    const [form] = Form.useForm();
    const onFinish = async (values) => {        
        setLoading(true);
        await Object.keys(values).forEach(key => values[key] === undefined ? delete values[key] : {});
        await updateDoc(productDocRef, values);
       if (totalVariation === 1) {
        const variationCollectionRef = collection(db, "product_collections", productId, "variations");
        const varaitionData = await getAllData(variationCollectionRef);
        for (let i = 0; i < varaitionData.length; i++) {
            const data = varaitionData[i];
            const variationDocRef = doc(db, "product_collections", productId, "variations", data.id);
            await updateDoc(variationDocRef, { price: values.price });
        }
       }
        setLoading(false);
        setIsDisabled(true);
        message.info(
            {
                content: <div>
                    product saved
                </div>,
                className: 'notify_saved_customer',
            });
    }
    return (
        <Form
            form={form}
            onFinish={onFinish}
            onFieldsChange={(changedFields, allFields) => {
                if (product[changedFields[0].name[0]] !== changedFields[0].value) {
                    setIsDisabled(false);
                } else {
                    setIsDisabled(true);
                }
            }}
            initialValues={{
                price: product?.price,
                price_per: product?.price_per,
                discountable: product?.discountable,
                pricing_method: product?.pricing_method
            }}
            layout="vertical"
            name="form_in_modal">
            <Row gutter={[12, 20]}>
                <Col span={6}>
                    <Row>
                        <Col span={20} offset={2}>
                        <h3>Price</h3>
                        <p>Choose a pricing method for this product</p>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <section className='pricing_method'>
                    <Form.Item noStyle name="pricing_method">          
                        <Radio.Group onChange={(e) => setValue(e.target.value)} value={value}>
                            <Space direction="vertical">
                                <Radio value={'Flat fee'}>
                                    <h3>Flat fee</h3>
                                    <p>Flat rate per period (for example: $50 per day)</p>
                                    {value === 'Flat fee' ? (
                                        <Row gutter={[20, 0]} className='pricing_box'>
                                            <Col span={12}>
                                                <Form.Item label={<h3>Price</h3>} style={{ marginBottom: 0 }} >
                                                    <Form.Item name="price" noStyle rules={[{ required: true, message: `can't be blank` }]}>
                                                        <Input
                                                            placeholder="50"
                                                            prefix={<DollarOutlined />}
                                                            size="large"
                                                            disabled={totalVariation > 1}
                                                        />
                                                    </Form.Item>
                                                    {totalVariation > 1 ? <small>Price per day is set per <Link to="variations">variation</Link></small> : ''}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item label={<h3>Per</h3>} style={{ marginBottom: 0 }}>
                                                    <Form.Item name="price_per" noStyle rules={[{ required: true, message: `can't be blank` }]}>
                                                        <Select size="large">
                                                            <Option value="Hour">Hour</Option>
                                                            <Option value="Day">Day</Option>
                                                            <Option value="Week">Week</Option>
                                                            <Option value="Month">Month</Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ) : null}
                                </Radio>
                                <Radio value={'Fixed Price'}>
                                    <h3>Fixed Price</h3>
                                    <p>Flat rate per period (for example: $50 per day)</p>
                                    {value === 'Fixed Price' ? (
                                        <Row gutter={[20, 0]} className='pricing_box'>
                                            <Col span={12}>
                                                <Form.Item label={<h3>Price</h3>} style={{ marginBottom: 0 }} >
                                                    <Form.Item name="price" noStyle rules={[{ required: true, message: `can't be blank` }]}>
                                                        <Input
                                                            placeholder="50"
                                                            prefix={<DollarOutlined />}
                                                            size="large"
                                                            disabled={totalVariation > 1}
                                                        />
                                                    </Form.Item>
                                                    {totalVariation > 1 ? <small>Price per day is set per <Link to="variations">variation</Link></small> : ''}
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ) : null}
                                </Radio>
                                <Form.Item
                                    name="discountable"
                                    valuePropName="checked"
                                    style={{marginBottom: 0}}                                    
                                >
                                    <Checkbox>
                                    <h3>Discountable</h3>
                                    <p>Note: does not affect price changes from pricing rules or bundles</p>
                                    </Checkbox>
                                </Form.Item>                                
                            </Space>
                        </Radio.Group>
                        </Form.Item>
                    </section>
                </Col>
                <Col span={20}>
                    <hr />
                </Col>
                <Col span={2} offset={15}>
                    <div className="submitBtn">
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size='large' loading={loading} disabled={isDisabled}>
                                Save
                            </Button>
                        </Form.Item>
                    </div>
                </Col>
            </Row>
        </Form>
    );
};

export default ProductPricing;