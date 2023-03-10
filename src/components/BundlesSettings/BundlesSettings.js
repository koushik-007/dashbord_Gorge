import React, { useState } from 'react';
import { Button, Col, Form, Input, message, Row, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadedImg } from '../UploadCustom/UploadCustom';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../Firebasefunctions/db';
import { doc, updateDoc } from 'firebase/firestore';
import CustomSpinner from '../CustomSpinner/CustomSpinner';

const { TextArea } = Input;

const BundlesSettings = ({ bundleData, BundlesId, setBundleData }) => {
    let navigate = useNavigate();
    const [form] = Form.useForm();

    const [isDisabled, setIsDisabled] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const bundlesDocRef = doc(db, "bundles_collections", BundlesId);
    const onFinish = async (values) => {
        console.log(values);
    }

    const handleDelete = () => {

    }
    const handleUploadImage = async ({ fileList }) => {
        if (fileList[0].originFileObj == null) return;
        setImageLoading(true);
        const imageRef = ref(storage, `images/${fileList[0].originFileObj.name}`);
        await uploadBytes(imageRef, fileList[0].originFileObj).then(async (snapshot) => {
            const url = await getDownloadURL(snapshot.ref);
            await updateDoc(bundlesDocRef, { imageUrl: url, imageName: fileList[0].originFileObj.name });
            setBundleData((curr) => ({ ...curr, imageUrl: url, imageName: fileList[0].originFileObj.name }));
            setImageLoading(false);
        });
    };

    const handleDeleteImage = () => {
        setImageLoading(true);
        const desertRef = ref(storage, `images/${bundleData.imageName}`);
        deleteObject(desertRef).then(async () => {
            await updateDoc(bundlesDocRef, { imageUrl: '', imageName: '' });
            setBundleData((curr) => ({ ...curr, imageUrl: '', imageName: '' }));
            setImageLoading(false);
            message.info(
                {
                    content: <div>
                        image removed successfully !
                    </div>,
                    className: 'notify_saved_customer',
                });
        }).catch((error) => {
            setImageLoading(false);
            message.error("Image is not removed")
        });        
    }
    return (
        <div className="parent-add-product">
            <section className="section-1">
                <Form
                    onFinish={onFinish}
                    //autoComplete="off"
                    onFieldsChange={(changedFields, allFields) => {
                        if (bundleData[changedFields[0].name[0]] !== changedFields[0].value) {
                            setIsDisabled(false);
                        } else {
                            setIsDisabled(true);
                        }
                    }}
                    initialValues={{
                        bundleName: bundleData?.bundleName,
                    }}
                    form={form}
                    layout="vertical"
                    name="form_in_modal">
                    <Row justify='space-between' gutter={[0, 12]}>
                        <Col span={6}>
                            <div className="add-product-title-container">
                                <h3>General information</h3>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div className="pricing_method">
                                <Form.Item label={<h3>Name</h3>}>
                                    <Form.Item name="bundleName" rules={[{ required: true, message: `can't be blank` }]}>
                                        <Input type='text' />
                                    </Form.Item>
                                </Form.Item>
                            </div>
                        </Col>
                        <Col span={18} offset={6}>
                            <div className="pricing_method">
                                <h3>Image</h3>
                                {
                                    bundleData?.imageUrl && bundleData?.imageUrl.length > 0 ?
                                        <UploadedImg srcImg={bundleData?.imageUrl} onDelete={handleDeleteImage} imageLoading={imageLoading} />
                                        :
                                        <Upload
                                            onChange={handleUploadImage}
                                            listType="picture-card"
                                            showUploadList={false}
                                        >
                                            <div>
                                                {
                                                    imageLoading ?
                                                        <>
                                                            <CustomSpinner />
                                                            <h3>Uploading</h3>
                                                        </>
                                                        : <h3>Upload</h3>
                                                }
                                            </div>
                                        </Upload>
                                }
                            </div>
                        </Col>
                        <Col span={24}>
                            <hr />
                        </Col>
                        <Col span={18} offset={3}>
                            <div className="submitBtn">
                                <Button size='large' type='danger' loading={deleteLoading}>Delete</Button>
                                <Button size='large' onClick={() => navigate('/bundles')}>Cancel</Button>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" size='large' loading={loading} disabled={deleteLoading || isDisabled}>
                                        Save
                                    </Button>
                                </Form.Item>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </section>
        </div>
    );
};

export default BundlesSettings;