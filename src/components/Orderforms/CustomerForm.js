import { Col, Button, Input, DatePicker, Spin } from 'antd';
import { collection } from 'firebase/firestore';
import React, { useState, useEffect, memo, useRef } from 'react';
import { addDocumentData, db, getAllData } from '../../Firebasefunctions/db';
import { FiUserPlus } from 'react-icons/fi';
import { PlusOutlined, SearchOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import RemoveCustomerModal from '../OrderModals/RemoveCustomerModal';
import AddCustomerModal from '../OrderModals/AddCustomerModal';

const { RangePicker } = DatePicker;

const CustomerForm = ({ orderData, pickupNReturnDate, handleDate, handleRemoveCustomer, handleAddCustomer, isRemoveCustomerLoading }) => {
    const [showCustomers, setShowCustomers] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRemoveCustomerModal, setIsRemoveCustomerModal] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({ name: '', customerType: "individual" });

    const customersCollectionsRef = collection(db, "customers_collections");
    const getData = async () => {
        if (data.length === 0) {
            setLoading(true);
            const data = await getAllData(customersCollectionsRef);
            setData(data);
        }
        setLoading(false);
    }
    const handleCreateCustomer = async () => {
        if (customerDetails.name.length < 1 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(customerDetails.email))) {
            return;
        }
        setLoading(true);
        const res = await addDocumentData(customersCollectionsRef, customerDetails);
        const { id } = res;
        const { name, firstName, lastName, email } = customerDetails;
        await handleAddCustomer({ name, firstName, lastName, email, customerId: id })
        setIsModalVisible(false);
        setShowCustomers(false);
        setLoading(false);
    }
    const ref = useRef(null);
    useEffect(() => {
        function close(e) {
            try {
                if (!ref?.current?.contains(e.target)) {
                    setShowCustomers(false);
                }
                else {
                    setShowCustomers(true)
                }
            } catch (error) {
                console.log(error);
            }
        }
        document.body.addEventListener('click', close);        
    }, []);
    return (
        <>
            <Col lg={12} xs={24}>
                <div className='container-box'>
                    <div className="box">
                        <div className="box-inner">
                            <div className='firstBox'>
                                <h3>Customer</h3>
                                {
                                    orderData?.name ?
                                        <div className="addedCustomer">
                                            <div className="avatar">
                                                <div>
                                                    {
                                                        orderData['firstName'] && orderData['lastName'] ?
                                                            orderData?.firstName[0] + orderData?.lastName[0]
                                                            :
                                                            'NA'
                                                    }
                                                </div>
                                                <div>
                                                    <b>{orderData?.name}</b>
                                                    <b>{orderData?.email}</b>
                                                </div>
                                            </div>
                                            <div className="removeCustomer">
                                                <Button onClick={() => setIsRemoveCustomerModal(true)} type='text' icon={<CloseOutlined style={{ fontWeight: '500' }} />} />
                                            </div>
                                        </div>
                                        :
                                        <div className="bundleContentDropDown" ref={ref} >
                                            <Input.Group compact>
                                                <Input
                                                    style={{
                                                        width: 'calc(100% - 40px)',
                                                    }}
                                                    onClick={() => { setShowCustomers(true); getData() }} size="large" placeholder="Search" className='inputSearch' prefix={loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : <SearchOutlined className='searchIcon' />}
                                                />
                                                <Button size='large' onClick={() => setIsModalVisible(true)} icon={<FiUserPlus />} />
                                            </Input.Group>
                                            <div className={`dropdownOption ${showCustomers ? 'activated' : ''}`}>
                                                <div className='showingOptions'>
                                                    {
                                                        loading ? <p>Loading...</p>
                                                            :
                                                            <p>Showing 1-{data.length} of {data.length}</p>
                                                    }
                                                </div>
                                                {
                                                    data.map((customer, index) => {
                                                        const { name, firstName, lastName, email, id } = customer;
                                                        return (<div className='options' key={index} onClick={() => handleAddCustomer({ name,firstName, lastName, email, customerId: id })}>
                                                            <div className='avatar'>
                                                                <div>
                                                                    {
                                                                        firstName && lastName ?
                                                                            firstName[0] + lastName[0]
                                                                            :
                                                                            'NA'
                                                                    }
                                                                </div>
                                                                <b>{name}</b>
                                                            </div>
                                                            <div className="addOptionBtn">
                                                                <button><PlusOutlined color='white' /> &nbsp;Add customer</button>
                                                            </div>
                                                        </div>
                                                        )
                                                    })}
                                                <small onClick={() => setIsModalVisible(true)}>Create customer</small>
                                            </div>
                                        </div>
                                }
                            </div>
                            <div className='secondBox'>
                                <div className='selectdate'>
                                    <div>
                                        <h3>Pickup</h3>
                                    </div>
                                    <div>
                                        <h3>Return</h3>
                                    </div>
                                    <div className='rangePicker'>
                                        <RangePicker
                                            disabledDate={ (current) => current && current < moment().startOf('day')}
                                            value={pickupNReturnDate.length > 0 ? [moment(pickupNReturnDate[0]), moment(pickupNReturnDate[1])] : []}
                                            onChange={(date, dateString) => handleDate(dateString)}
                                            size='large'
                                            placeholder={['pickup', 'return']}
                                            format="YYYY-MM-DD HH:mm"
                                            showTime={{
                                                format: 'HH:mm'
                                            }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Col>

            <RemoveCustomerModal
                isRemoveCustomerModal={isRemoveCustomerModal}
                setIsRemoveCustomerModal={setIsRemoveCustomerModal}
                isRemoveCustomerLoading={isRemoveCustomerLoading}
                handleRemoveCustomer={handleRemoveCustomer}
            />
            <AddCustomerModal
                setCustomerDetails={setCustomerDetails}
                customerDetails={customerDetails}
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                handleCreateCustomer={handleCreateCustomer}
                loading={loading}
            /></>
    );
};

export default memo(CustomerForm);