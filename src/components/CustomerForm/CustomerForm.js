import { Col, Row, Input, Select, Collapse, Button, Form, InputNumber } from 'antd';
import React from 'react';
import { useState } from 'react';
import { PercentageOutlined } from "@ant-design/icons";
import "./CustomerForm.css";
import { doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, deleteDocument } from '../../Firebasefunctions/db';


const { Option } = Select;
const { Panel } = Collapse;

const CustomerForm = ({ isDelete = false, loading, id, isDisabled=false }) => {
    const navigate = useNavigate();
    const [deleteLoading, setDeleteLoading] = useState(false);
    

    const handleDelete = async () => {
        setDeleteLoading(true);
        const variationDoc = doc(db, "customers_collections", id);
        await deleteDocument(variationDoc);
        setDeleteLoading(false)
        navigate('/customers')
    }
    
    return (
        <>
            <Row className='customerRow'>
                <Col sm={24} md={24} lg={17}>
                    <Row gutter={[24, 8]}>
                        <Col sm={24} md={18} lg={8}>
                            <div className="infoBox">
                                <h3>General information</h3>
                                <div>
                                    The information you enter here will be used on documents like invoices and to identify the customer.
                                </div>
                            </div>
                        </Col>
                        <Col sm={24} md={18} lg={16}>
                            <div className='customerForm'>
                                <Form.Item name="name" rules={[{ required: true, message: `can't be blank` }]}>
                                    <Input className='customFormInput' size="large" placeholder="Customer name..." style={{ borderRadius: '7px', fontWeight: '500' }} />
                                </Form.Item>
                                <hr className='divider' />
                                <div className='formContainer'>
                                    <div className="formBox">
                                        <h2>Information</h2>
                                        <div>
                                            <Form.Item label="Email">
                                                <Form.Item name="email" rules={[{ required: true, message: `can't be blank email` }]}>
                                                    <Input className='customFormInput' type='email' />
                                                </Form.Item>
                                            </Form.Item>
                                        </div>
                                        <div className='formBoxSelect'>
                                            <Form.Item label="Customer type" name="customerType">
                                                <Select
                                                    showSearch
                                                    style={{ width: '100%' }}
                                                >
                                                    <Option value="individual">Individual</Option>
                                                    <Option value="company">Company</Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div>
                                            <Form.Item label="phone" name="phone">
                                                <Input className='customFormInput' />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="formBox">
                                        <h2>Settings</h2>
                                        <div>
                                            <Form.Item label="Discount percentage" name="discountPercentage" className='customFormInputNumber'>
                                                <InputNumber prefix={<PercentageOutlined />} />
                                            </Form.Item>
                                        </div>
                                        <div className='formBoxSelect'>
                                            <Form.Item label="Tax profile" name="taxProfile">
                                                <Select
                                                    showSearch
                                                    style={{ width: '100%' }}
                                                >
                                                    <Option value="noTaxProfile">No tax profile</Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <hr className='divider' />
                    <Row gutter={[24, 8]}>
                        <Col sm={24} md={18} lg={8}>
                            <div className="infoBox">
                                <h3>Addresses</h3>
                                <div>
                                    The addresses will be shown on the order itself and on its documents.
                                </div>
                                <div>
                                    Usually, the address has to be on documents for legal reasons but it can also be used for shipping or delivery.
                                </div>
                            </div>
                        </Col>
                        <Col sm={24} md={18} lg={16}>
                            <div className='customerForm'>
                                <Collapse defaultActiveKey={['1']} expandIconPosition="end">
                                    <Panel header={<strong>Main address</strong>} key="1">
                                        <div style={{ width: '100%' }}>
                                            <div className='formContainer'>
                                                <div className="formBox">
                                                    <Form.Item label="First name" name="firstName">
                                                        <Input className='customFormInput' />
                                                    </Form.Item>
                                                </div>
                                                <div className="formBox">
                                                    <Form.Item label="Last name" name="lastName">
                                                        <Input className='customFormInput' />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className='formBox address'>
                                                <Form.Item label="Address" name="address">
                                                    <Input className='customFormInput' />
                                                </Form.Item>
                                            </div>
                                            <div className='formContainer'>
                                                <div className="formBox">
                                                    <Form.Item label="ZipCode" name="zipCode">
                                                        <Input className='customFormInput' />
                                                    </Form.Item>
                                                </div>
                                                <div className="formBox">
                                                    <Form.Item label="City" name="city">
                                                        <Input className='customFormInput' />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className='formContainer'>
                                                <div className="formBox">
                                                    <Form.Item label="Region" name="region">
                                                        <Input className='customFormInput' />
                                                    </Form.Item>
                                                </div>
                                                <div className="formBox">
                                                    <Form.Item label="Country" name="country">
                                                        <Input className='customFormInput' />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                    </Panel>
                                </Collapse>
                            </div>
                        </Col>
                    </Row>
                    <hr className='divider' />
                    
                    <div className="submitBtn">
                    {
                        isDelete &&
                        <div>
                            <Button size='large' type='danger' onClick={handleDelete} loading={deleteLoading}>Delete customer</Button>
                        </div>
                    }
                        <Button size='large' onClick={() => navigate('/customers')}>Cancel</Button>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" size='large' loading={loading} disabled={deleteLoading || isDisabled}>
                                Save
                            </Button>
                        </Form.Item>                      
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default CustomerForm;