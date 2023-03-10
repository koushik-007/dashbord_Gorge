import React, { useState } from 'react';
import Header from "../../../components/Header"
import CustomerForm from '../../../components/CustomerForm/CustomerForm';
import { collection } from 'firebase/firestore';
import { addDocumentData, db } from '../../../Firebasefunctions/db';
import { useNavigate } from 'react-router-dom';
import { Form, Layout } from 'antd';

const { Content } = Layout;

const AddCustomer = () => {
    const navigate = useNavigate();

    const customersCollectionsRef = collection(db, "customers_collections");
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        await Object.keys(values).forEach(key => values[key] === undefined ? delete values[key] : {});
        const res = await addDocumentData(customersCollectionsRef, values);
        navigate(`/customers/details/${res.id}/edit`);
        setLoading(false);
    }
    return (
        <>
            <Header>
                <h1>New customer</h1>
            </Header>
            <Content className='main_content'>
                <Form
                    name="customer-form"
                    className="customer-form"
                    initialValues={{ customerType: "individual", taxProfile: "No tax profile" }}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <CustomerForm loading={loading} />
                </Form>
            </Content>
        </>
    );
};

export default AddCustomer;