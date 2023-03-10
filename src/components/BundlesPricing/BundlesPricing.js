import { Button, Checkbox, Col, Form, Input, message, Row, Select, Space } from 'antd';
import { DollarOutlined } from "@ant-design/icons";
import { doc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../Firebasefunctions/db';

const { Option } = Select;

const BundlesPricing = ({ bundleData, BundlesId }) => {
    const [showTaxable, setShowTaxable] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [fixedPrice, setFixedPrice] = useState(false);
    const bundlesDocRef = doc(db, "bundles_collections", BundlesId);
    const [form] = Form.useForm();
    const onFinish = async (values) => {
        setLoading(true);
        await Object.keys(values).forEach(key => values[key] === undefined ? delete values[key] : {});
        await updateDoc(bundlesDocRef, values);
        setLoading(false);
        setIsDisabled(true);
        message.info(
            {
                content: <div>
                    bundle saved
                </div>,
                className: 'notify_saved_customer',
            });
    }
useEffect(()=> {
    if (bundleData?.fixedPrice) {
        setFixedPrice(bundleData?.fixedPrice)
    }
}, [])
    return (
        <Form
            form={form}
            onFinish={onFinish}
            onFieldsChange={(changedFields, allFields) => {
                if (changedFields[0].name[0] === 'fixedPrice') {
                    setFixedPrice(changedFields[0].value);
                }
                if (bundleData[changedFields[0].name[0]] !== changedFields[0].value) {
                    setIsDisabled(false);
                } else {
                    setIsDisabled(true);
                }
            }}
            initialValues={{
                discountable: bundleData?.discountable,
                taxProfile: bundleData?.taxProfile,
                fixedPrice: bundleData?.fixedPrice,
                price: bundleData?.price
            }}
            layout="vertical"
            name="form_in_modal">
            <Row gutter={[12, 20]}>
                <Col span={6}>
                    <div>
                        <h3>Taxes and discounts</h3>
                    </div>
                </Col>
                <Col span={12}>
                    <section className='pricing_method'>
                        <Space direction="vertical">
                        <Form.Item
                                name="fixedPrice"
                                valuePropName="checked"
                                style={{ marginBottom: 0 }}
                            >
                                <Checkbox>
                                    <h3>Fixed Price</h3>
                                </Checkbox>
                            </Form.Item>
                            {fixedPrice ? (
                                <Row>
                                    <Col offset={1}>
                                        <div className="pricing_box">
                                            <Form.Item label={<h3>Price</h3>} style={{ marginBottom: 0 }} >
                                                <Form.Item name="price" noStyle rules={[{ required: true, message: `can't be blank` }]}>
                                                    <Input
                                                        placeholder="50"
                                                        prefix={<DollarOutlined />}
                                                        size="large"
                                                    />
                                                </Form.Item>
                                            </Form.Item>
                                        </div>
                                    </Col>
                                </Row>
                            ) : null}
                            <Checkbox checked={showTaxable} onChange={() => setShowTaxable(!showTaxable)}>
                                <h3>Taxable</h3>
                                <p>Product and customer tax profiles apply to this product.</p>
                            </Checkbox>
                            {
                                showTaxable &&
                                <Row>
                                    <Col offset={1}>
                                        <div className="pricing_box">
                                            <Form.Item label={<b>Product tax profile</b>} style={{ marginBottom: 5 }}>
                                                <Form.Item name="taxProfile" noStyle rules={[{ required: true, message: `can't be blank` }]}>
                                                    <Select size="large">
                                                        <Option value="noTaxProfile">No tax profile</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Form.Item>
                                            <p>Note: Customer tax profiles may still be charged on this product.</p>
                                        </div>
                                    </Col>
                                </Row>
                            }
                            <hr />
                            <Form.Item
                                name="discountable"
                                valuePropName="checked"
                                style={{ marginBottom: 0 }}
                            >
                                <Checkbox>
                                    <h3>Discountable</h3>
                                    <p>Note: does not affect price changes from pricing rules or bundles</p>
                                </Checkbox>
                            </Form.Item>                            
                        </Space >
                    </section >
                </Col >
                <Col span={20}>
                    <hr />
                </Col>
                <Col span={2} offset={15}>
                    <div className="submitBtn">
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size='large' loading={loading} disabled={loading || isDisabled}>
                                Save
                            </Button>
                        </Form.Item>
                    </div>
                </Col>
            </Row>
        </Form>
    );
};

export default BundlesPricing;