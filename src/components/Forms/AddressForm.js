import { Collapse, Input } from 'antd';
import React from 'react';

const { Panel } = Collapse;

const AddressForm = ({customerDetails, setCustomerDetails}) => {
    const handleDetails = ({ target }) => {
        setCustomerDetails((curr) => ({ ...curr, [target.name]: target.value }))
    }
    return (
        <>
        <h3>Addresses</h3>
            <Collapse defaultActiveKey={['1']} expandIconPosition="end">
                <Panel header={<strong>Main address</strong>} key="1">
                    <div style={{ width: '100%' }}>
                        <div className='formContainer'>
                            <div className="formBox">
                                <div>
                                    <label htmlFor="firstName">First name</label>
                                    <Input className='customFormInput' value={customerDetails?.firstName} name='firstName' type='text' bordered={false} onChange={handleDetails} />
                                </div>
                            </div>
                            <div className="formBox">
                                <div>
                                    <label htmlFor="lastName">Last name</label>
                                    <Input className='customFormInput' value={customerDetails?.lastName} name='lastName' type='text' bordered={false} onChange={handleDetails} />
                                </div>
                            </div>
                        </div>
                        <div className='formBox address'>
                            <label htmlFor="address">Address</label>
                            <Input className='customFormInput' value={customerDetails?.address} name='address' bordered={false} onChange={handleDetails} />
                        </div>
                        <div className='formContainer'>
                            <div className="formBox">
                                <div>
                                    <label htmlFor="zipCode">Zipcode</label>
                                    <Input className='customFormInput' value={customerDetails?.zipCode} name='zipCode' type='text' bordered={false} onChange={handleDetails} />
                                </div>
                            </div>
                            <div className="formBox">
                                <div>
                                    <label htmlFor="city">City</label>
                                    <Input className='customFormInput' value={customerDetails?.city} name='city' type='text' bordered={false} onChange={handleDetails} />
                                </div>
                            </div>
                        </div>
                        <div className='formContainer'>
                            <div className="formBox">
                                <div>
                                    <label htmlFor="region">Region</label>
                                    <Input className='customFormInput' value={customerDetails?.region} name='region' type='text' bordered={false} onChange={handleDetails} />
                                </div>
                            </div>
                            <div className="formBox">
                                <div>
                                    <label htmlFor="country">Country</label>
                                    <Input className='customFormInput' value={customerDetails?.country} name='country' type='text' bordered={false} onChange={handleDetails} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
            </Collapse>
        </>
    );
};

export default AddressForm;