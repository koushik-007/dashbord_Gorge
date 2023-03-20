import React from 'react';
import { Button, Form, Input, Modal, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { collection } from 'firebase/firestore';
import { addDocumentData, db } from '../../Firebasefunctions/db';
import { useState } from 'react';
const AddExtraModal = ({ isOpenModal, setIsOpenModal, orderId }) => {
    const [form] = Form.useForm();
    const extraCollRef = collection(db, "student_collections");
    const [loading, setLoading] = useState(false);
    return (
        <Modal
            open={isOpenModal}
            title="Create a new collection"
            okText="Create"
            cancelText="Cancel"
            onCancel={() => setIsOpenModal(false)}
            style={{ top: -20 }}
            footer={[
                <Button
                    className='propertyBtn'
                    size='large'
                    key="cancel"
                    onClick={() => setIsOpenModal(false)}
                >
                    Cancel
                </Button>,
                <Button
                    loading={loading}                   
                    size='large'
                    className='propertyBtn'
                    key="back"
                    type='primary'
                    onClick={() => {
                        form
                            .validateFields()
                            .then(async (values) => {
                                setLoading(true);
                                await addDocumentData(extraCollRef, {...values, orderId});
                                form.resetFields();
                                setLoading(false);
                                setIsOpenModal(false)
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    >
                    Save
                </Button>
            ]}            
        >
            <Form
                form={form}
                layout="vertical"
                name="dynamic_form_nest_item"                
            >
                <Form.Item
                    name="schoolName"
                    label="School name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the school name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="teacherName"
                    label="Teacher name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the teacher name!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.List name="students">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                    key={key}
                                    style={{
                                        display: 'flex',
                                        marginBottom: 8,
                                    }}
                                    align="baseline"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'firstName']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing first name',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="First Name" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'lastName']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing last name',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="Last Name" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'size']}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Missing size',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="size" />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Students
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default AddExtraModal;