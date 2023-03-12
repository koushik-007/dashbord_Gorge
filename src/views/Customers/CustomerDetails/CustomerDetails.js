import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form, Layout, message, Spin, Tabs } from 'antd';
import CustomerForm from '../../../components/CustomerForm/CustomerForm';
import { doc, updateDoc } from 'firebase/firestore';
import { db, getAData } from '../../../Firebasefunctions/db';
import CustomerOrder from '../CustomerOrder/CustomerOrder';


const { Content } = Layout;

const CustomerDetails = () => {
    const { id } = useParams();
    const { pathname } = useLocation();
    const naviage = useNavigate();
    const [form] = Form.useForm();
    const [customerDetails, setCustomerDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const customerDocRef = doc(db, "customers_collections", id);
    useEffect(() => {
        setLoading(true);
        const getData = async () => {
            const data = await getAData(customerDocRef);
            form.setFieldsValue(data);
            setCustomerDetails(data);
            setLoading(false);
        }
        getData();
    }, []);
    const onFinish = async (values) => {
        setIsUpdateLoading(true);
        await Object.keys(values).forEach(key => values[key] === undefined ? delete values[key] : {});
        await updateDoc(customerDocRef, values);
        setIsUpdateLoading(false);
        message.info(
            {
                content: <div>
                    Successfully saved customer
                </div>,
                className: 'notify_saved_customer',           
            });      
    }
    return (
        <>
            {
                loading ?
                    <div className="example">
                        <Spin />
                    </div>
                    :
                    <>
                        <Header>
                            <h1> {form.getFieldValue("name")} </h1>
                        </Header>
                        <Content className='main_content'>
                            <Tabs 
                            defaultActiveKey={pathname}
                            activeKey={pathname}
                            onChange={(key) => naviage(key)}
                             items={[
                                {
                                    label: 'Information', key: `/customers/details/${id}/edit`, children: <Form
                                        form={form}
                                        name="customer-form"
                                        className="customer-form"
                                        initialValues={{ customerType: "individual", taxProfile: "No tax profile" }}
                                        layout="vertical"
                                        onFinish={onFinish}
                                        onFieldsChange={(changedFields, allFields) => {
                                            if (customerDetails[changedFields[0].name[0]] !== changedFields[0].value) {
                                                setIsDisabled(false);
                                            } else {
                                                setIsDisabled(true);
                                            }
                                        }}
                                    >
                                        <CustomerForm loading={isUpdateLoading} isDelete={true} id={id} isDisabled={isDisabled} />
                                    </Form>
                                },
                                { label: 'Orders', key: `/customers/details/${id}/orders`, children: <CustomerOrder customerId={id} /> },                                
                            ]}>
                            </Tabs>
                        </Content>
                    </>
            }
        </>
    );
};

export default CustomerDetails;