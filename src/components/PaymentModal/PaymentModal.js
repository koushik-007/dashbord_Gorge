import React, { useState, useContext } from 'react';
import { Button, DatePicker, Form, Input, Menu, message, Select } from 'antd';
import "./PaymentModal.css"
import { items } from './itemData';
import OrderCalculations from './OrderCalculations';
import CustomModal from './CustomModal';
import moment from 'moment';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebasefunctions/db';
import { AllOrderDataProvder } from '../../context/AllOrderDataContext';
import { useEffect } from 'react';

const { Option } = Select;

const PaymentModal = ({ isModalOpen, setIsModalOpen, orderData, selectedKey, setSelectedKey }) => {
    const { orderNumber, price, key, amount, secuirityDeposit } = orderData;
    const [data, setData] = useContext(AllOrderDataProvder)
    const [form] = Form.useForm();

    const [secuirityDepositPrice, setSecuirityDepositePrice] = useState(secuirityDeposit ? secuirityDeposit : 0);
    const [loading, setLoading] = useState(false);
    const [outstanding, setOutstanding] = useState(0);
    const [registerPrice, setRegisterPrice] = useState(0);
    useEffect(()=> {
        let outstanding = Number(Math.abs(price - (amount)).toFixed(2));
        form.setFieldValue('amount', outstanding)
        setOutstanding(outstanding);
        setRegisterPrice(outstanding);
    },[isModalOpen]);
   
    const handleRegisterPayment = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            const orderDocRef = doc(db, "orders_collections", key);
            const filterValue = {
                ...values,
                'amount': parseFloat(values['amount']) + amount,
                'secuirityDeposit': parseFloat(values['secuirityDeposit']),
                'registerPaymentDate': values['registerPaymentDate'].format('YYYY-MM-DD'),
            }
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...filterValue });
                await updateDoc(orderDocRef, filterValue);
                setData(newData);
            }
            setIsModalOpen(false);
            message.info(
                {
                    content: <div>
                        Payment is added
                    </div>,
                    className: 'notify_saved_customer',
                });
            form.resetFields();
            setLoading(false);
        } catch (error) {
            console.log('Validate Failed:', error);
            message.info(
                {
                    content: <div>
                        Payment is not added. Try again later.
                    </div>,
                    className: 'notify_saved_customer',
                });
            setLoading(false);
        }
    }
    const handleRefundPayment = async () => {

    }
    if (selectedKey === '0') {
        return (
            <CustomModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setSelectedKey={setSelectedKey}
                footer={[
                    <Button key="back" onClick={() => setSelectedKey('')}>
                        Back
                    </Button>,
                    outstanding >= 0 ?
                        <>
                            {
                                registerPrice + amount > price ?
                                    <Button danger type='primary'>
                                       Amount is over. It should be {price - amount}
                                    </Button>
                                    :
                                    <Button
                                        loading={loading}
                                        type='primary'
                                        onClick={handleRegisterPayment}>
                                        Register payment of {registerPrice}
                                    </Button>
                            }
                        </>
                        :
                        <Button
                            danger
                            loading={loading}
                            type='primary'
                            onClick={handleRefundPayment}>
                            Register refund of {outstanding}
                        </Button>
                ]}>
                <div className="paymentModalContainer">
                    <OrderCalculations
                        orderNumber={orderNumber}
                        price={price}
                        securityDeposite={secuirityDeposit}
                        paid={amount}
                    />
                    <div className="paymentModalBox">
                        <div className="mutualPaymet">
                            <Form
                                onFieldsChange={(_, fileds) => {
                                    if (_[0].name[0] === "amount") {
                                        setRegisterPrice(parseFloat(_[0].value ? _[0].value : 0))
                                    }
                                    if (_[0].name[0] === "secuirityDeposit") {
                                        setSecuirityDepositePrice(parseFloat(_[0].value))
                                    }
                                }}
                                initialValues={{
                                    amount: outstanding,
                                    method: 'Bank',
                                    secuirityDeposit: Number(0).toFixed(2),
                                    registerPaymentDate: moment(new Date())
                                }}
                                form={form}
                                layout="vertical"
                                name="form_in_modal">
                                <div className="mutualPaymetInput">
                                    <div className='mutualPaymetInputBox'>
                                        <label htmlFor="amount">Amount</label>
                                        <Form.Item name="amount" rules={[{ required: true, message: <>Can't be blank</> }]} >
                                            <Input placeholder="Amount" size='large' type='text' />
                                        </Form.Item>
                                    </div>
                                    <div className='mutualPaymetInputBox'>
                                        <label htmlFor="secuirityDeposit">Secuirity deposit</label>
                                        <Form.Item name="secuirityDeposit"
                                            rules={[{ required: true, message: <>Can't be blank</> }]}
                                        >
                                            <Input placeholder="Amount" size='large' type='text' />
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className="mutualPaymetInput">
                                    <div className='mutualPaymetInputBox'>
                                        <label htmlFor="registerPaymentDate">Date</label>
                                        <Form.Item name="registerPaymentDate" rules={[{ required: true, message: <>Can't be blank</> }]}>
                                            <DatePicker size='large' />
                                        </Form.Item>
                                    </div>
                                    <div className='mutualPaymetInputBox'>
                                        <label htmlFor="method">Method</label>
                                        <Form.Item name='method'>
                                            <Select size='large' allowClear>
                                                {
                                                    ['Bank', 'Card', 'Cash', 'Cheque', 'Voucher', 'Other']
                                                        .map((value) => (<Option value={value} key={value}>{value}</Option>))
                                                }
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </CustomModal>
        );
    }

    return (
        <CustomModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setSelectedKey={setSelectedKey}
            footer={[
                <Button key="back" onClick={() => setIsModalOpen(false)}>
                    Cancel
                </Button>
            ]}>
            <div className="paymentModalContainer">
                <OrderCalculations
                    orderNumber={orderNumber}
                    price={price}
                    secuirityDeposit={secuirityDeposit}
                    paid={amount + secuirityDepositPrice}
                />
                <div className="paymentModalBox">
                    <div className="method">
                        <h5>How would you like to add a payment?</h5>
                        <Menu
                            selectable={true}
                            className='paymentStatusMenu'
                            onClick={({ key }) => { setSelectedKey(key); }}
                            items={
                                items.map(({ title, subTitle, icon }, index) => ({
                                    label: <span>
                                        <div>{title}</div>
                                        <div>
                                            <small>{subTitle}</small>
                                        </div>
                                    </span>,
                                    key: index,
                                    icon: icon,
                                }))}
                        />
                    </div>
                </div>
            </div>
        </CustomModal>
    );
};

export default PaymentModal;