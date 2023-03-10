import { Button, Form, Input, Modal, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { BsExclamationTriangle } from "react-icons/bs"

const { Item } = Form;

const AddInfoModal = ({ info, showInfoModal, setShowInfoModal, hanldeDelete, handleSaveInfo, handleEditInfo }) => {
    const datatyps = [
        {
            value: 'singleLine',
            title: 'Single line text'
        },
        {
            value: 'multiLine',
            title: 'Multi-line text'
        },
        {
            value: 'date',
            title: 'Date'
        },
        {
            value: 'address',
            title: 'Address'
        },
        {
            value: 'phone',
            title: 'Phone'
        },
    ]

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(info)
    }, [info]);
    const [isInfoAdded, setIsInfoAdded] = useState(false);
    const [isInfoDeleted, setIsInfoDeleted] = useState(false);

    return (
        <Modal
            destroyOnClose={true}
            open={showInfoModal}
            title="New custom field"
            onCancel={() => setShowInfoModal(false)}
            style={{top: -20}}
            footer={[
                info.fieldLabel &&
                <Button
                    loading={isInfoDeleted}
                    onClick={ async () => {
                        setIsInfoDeleted(true);
                        await hanldeDelete(info.id);
                        setIsInfoDeleted(false);
                    }}
                    size='large'
                    danger
                    className='propertyBtn'
                    key="delete"
                    type='primary'>
                    Delete custom field
                </Button>,
                <Button
                    className='propertyBtn'
                    size='large'
                    key="cancel"
                    onClick={() => setShowInfoModal(false)}
                >
                    Cancel
                </Button>,
                <Button
                    loading={isInfoAdded}
                    onClick={() => {
                        form
                            .validateFields()
                            .then(async(values) => {
                                setIsInfoAdded(true);
                                if (info.fieldLabel) {
                                    handleEditInfo(values)
                                }
                                else
                                await handleSaveInfo(values);
                                form.resetFields();
                                setIsInfoAdded(false);
                            })
                            .catch((info) => {
                                console.log('Validate Failed:', info);
                            });
                    }}
                    size='large'
                    className='propertyBtn'
                    key="back"
                    type='primary'>
                    Save
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={info}
            >
                <div className="addInfoModal">
                    <div className="info-box-0">
                        <div>
                            <label htmlFor="fieldLabel">Custom field label</label>
                            <Item
                                name="fieldLabel"
                                rules={[
                                    {
                                        required: true,
                                        message: <><BsExclamationTriangle />&nbsp; Can't be blank</>,
                                    },
                                ]}
                            >
                                <Input size='large' type='text' />
                            </Item>
                        </div>
                    </div>
                    <div className="info-box-2">
                        <div className='formBoxSelect'>
                            <label htmlFor="dataType">dataType</label>
                            <Item
                                name="dataType"
                            >
                                <Select
                                    disabled={info.fieldLabel}
                                    size='large'
                                    showSearch
                                    style={{ width: '100%' }}
                                >
                                    {
                                        datatyps.map(({ value, title }, index) => (
                                            <Select.Option value={value} key={index}>{title}</Select.Option>
                                        ))
                                    }
                                </Select>
                            </Item>
                        </div>
                    </div>
                    <div className="info-box-0">
                        <div>
                            <label htmlFor="information">Information</label>
                            <Item
                                name="information"
                                rules={[
                                    {
                                        required: true,
                                        message: <><BsExclamationTriangle />&nbsp; Can't be blank</>,
                                    },
                                ]}
                            >
                                <Input size='large' type='text' />
                            </Item>
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>
    );
};

export default AddInfoModal;