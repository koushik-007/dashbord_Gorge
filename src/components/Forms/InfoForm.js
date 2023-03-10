import { Dropdown, Input, Menu, Select } from 'antd';
import React, { useState } from 'react';
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { countries } from 'country-list-json';
import "./InfoForm.css";


const { Option } = Select;
const InfoForm = ({ showError, setCustomerDetails }) => {
    const [selectedCountry, setSelectedCountry] = useState('BD');
    const image = require('../../images/flags/' + selectedCountry + '.svg');
    const handleSelect = (option) => {
        setSelectedCountry(option);
    }

    const handleDetails = ({ target }) => {
        setCustomerDetails((curr) => ({ ...curr, [target.name]: target.value }))
    }
    return (
        <>
            {/* <Input  value={customerDetails?.name} status={customerDetails?.name.length < 1 && showError ? 'error' : ''} size="large" placeholder="Customer name..." style={{ borderRadius: '7px', fontWeight: '500' }} name="name" onChange={handleDetails} />
            {
                customerDetails?.name.length < 1 && showError ? <div className="errorBox">
                    <p><BsExclamationTriangle /></p>
                    <p> can't be blank</p>
                </div> : ''
            }
            <hr className='divider' /> */}
            <div className='infor-container'>
                <div className="info-box-0">
                    <div>
                        <label htmlFor="name">Name</label>
                        <Input size='large' name='name' type='text' onChange={handleDetails} prefix={<UserOutlined />}  />
                    </div>
                </div>
                <div className="info-box-1">
                    <div>
                        <label htmlFor="email">Email</label>
                        <Input required size='large' name='email' type='email' onChange={handleDetails} prefix={<MailOutlined />} />
                    </div>
                </div>
                <div className="info-box-2">
                    <div className='formBoxSelect'>
                        <label htmlFor="customerType">Customer type</label>
                        <Select
                            size='large'
                            showSearch
                            name="customerType"
                            defaultValue="individual"
                            style={{ width: '100%' }}
                            onSelect={(value) => setCustomerDetails((curr) => ({ ...curr, customerType: value }))}
                        >
                            <Option value="individual">Individual</Option>
                            <Option value="company">Company</Option>
                        </Select>
                    </div>
                </div>
                <div className="info-box-3">
                    <div>
                        <label htmlFor="phone">phone</label>
                        <Input size='large' name='phone' onBlur={handleDetails} 
                        prefix={
                            <Dropdown
                                overlayStyle={{ top: '55rem', height: '20rem', overflowY: 'scroll' }} placement="bottomLeft" 
                                menu={<Menu onClick={(e)=> handleSelect(e.key)} items={countries.map(({ name, code }) => {
                                    return { key: code, label: name }
                                })}
                                />} trigger={['click']}>
                                <img src={image} alt="none" width={'25px'} />
                            </Dropdown>
                            } 
                        />
                    </div>
                </div>
            </div>
        </>
    )
};

export default InfoForm;