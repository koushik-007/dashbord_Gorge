import React, { useState } from 'react';
import { Button, Col, Form, Input, message, Row, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { collection, doc, query, updateDoc, where } from 'firebase/firestore';
import { db, deleteDocument, getAllData, storage } from '../../Firebasefunctions/db';
import { UploadedImg } from '../UploadCustom/UploadCustom';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import CustomSpinner from '../CustomSpinner/CustomSpinner';

const { TextArea } = Input;

const ProductSettings = ({ product, productId, setProduct }) => {
    let navigate = useNavigate();
    const [form] = Form.useForm();

    const [isDisabled, setIsDisabled] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const productDocRef = doc(db, "product_collections", productId);
    const onFinish = async (values) => {
        setLoading(true);
        await Object.keys(values).forEach(key => values[key] === undefined ? delete values[key] : {});
        await updateDoc(productDocRef, values);
        const variationCollectionRef = collection(db, "product_collections", productId, "variations");
        const varaitionData = await getAllData(variationCollectionRef);
        for (let i = 0; i < varaitionData.length; i++) {
            const data = varaitionData[i];
            const variationDocRef = doc(db, "product_collections", productId, "variations", data.id);
            await updateDoc(variationDocRef, { product_name: values.product_name });
        }
        setLoading(false);
        setIsDisabled(true);
        message.info(
            {
                content: <div>
                    product saved
                </div>,
                className: 'notify_saved_customer',
            });
    }

    const ordersCollectionRef = collection(db, "orders_collections");
    const handleDeleteProduct = async () => {
        setDeleteLoading(true);
        const orderData = await getAllData(ordersCollectionRef);
        let result = [];
        for (let i = 0; i < orderData.length; i++) {
            const { id } = orderData[i];
            const orderProducts = collection(db, "orders_collections", id, "products");
            const q = query(orderProducts, where("productId", "==", productId))
            const querySnapshot = await getAllData(q);
            result.push(...querySnapshot)
        }
        if (result.length > 0) {
            setDeleteLoading(false);
            return message.error("this product has been reserved/picked up so it can't delete now");
        }
        else {
            const variationCollectionRef = collection(db, "product_collections", productId, "variations");
            const varaitionData = await getAllData(variationCollectionRef);
            for (let i = 0; i < varaitionData.length; i++) {
                const data = varaitionData[i];
                const variationDocRef = doc(db, "product_collections", productId, "variations", data.id);
                await deleteDocument(variationDocRef);
            }
            const productdoc = doc(db, "product_collections", productId);
            await deleteDocument(productdoc);
            if (product?.imageName) {
                const desertRef = ref(storage, `images/${product.imageName}`);
                deleteObject(desertRef).then(async (data) => {
                    console.log(data)
                }).catch((error) => {
                    setImageLoading(false);
                    message.error("Image is not removed")
                });
            }
            setDeleteLoading(false);
            navigate('/products')
        }
    }

    const handleUploadImage = async ({ fileList }) => {
        if (fileList[0].originFileObj == null) return;
        setImageLoading(true);
        const imageRef = ref(storage, `images/${fileList[0].originFileObj.name}`);
        await uploadBytes(imageRef, fileList[0].originFileObj).then(async (snapshot) => {
            const url = await getDownloadURL(snapshot.ref);
            await updateDoc(productDocRef, { imageUrl: url, imageName: fileList[0].originFileObj.name });
            setProduct((curr) => ({ ...curr, imageUrl: url, imageName: fileList[0].originFileObj.name }));
            setImageLoading(false);
        });
    };
    function handleDeleteImage() {
        setImageLoading(true);
        const desertRef = ref(storage, `images/${product.imageName}`);
        deleteObject(desertRef).then(async () => {
            await updateDoc(productDocRef, { imageUrl: '', imageName: '' });
            setProduct((curr) => ({ ...curr, imageUrl: '', imageName: '' }));
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
                        console.log({ changedFields });
                        if (product[changedFields[0].name[0]] !== changedFields[0].value) {
                            setIsDisabled(false);
                        } else {
                            setIsDisabled(true);
                        }
                    }}
                    initialValues={{
                        product_name: product?.product_name,
                        sku: product?.sku,
                        description: product?.description,
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
                            <div className="add-product-title-container ">
                                <div className="img-content">
                                    <Row justify='space-between' gutter={[24, 0]}>
                                        <Col span={24} className="formBox">
                                            <Form.Item label="Name">
                                                <Form.Item name="product_name" rules={[{ required: true, message: `can't be blank` }]}>
                                                    <Input className='customFormInput' type='text' />
                                                </Form.Item>
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} className="formBox">
                                            <Form.Item label="Stock Keeping Unit(SKU)">
                                                <Form.Item name="sku" rules={[{ required: true, message: `can't be blank` }]}>
                                                    <Input className='customFormInput' type='text' />
                                                </Form.Item>
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} className="formBox">
                                            <Form.Item label="Description on documents">
                                                <Form.Item name="description" rules={[{ required: true, message: `can't be blank` }]}>
                                                    <TextArea rows={4} />
                                                </Form.Item>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div className="img-content" style={{ marginLeft: '23.8rem', flexDirection: 'column' }}>
                                <h5><b>Image</b></h5>
                                {
                                    product.imageUrl && product.imageUrl.length > 0 ?
                                        <UploadedImg srcImg={product.imageUrl} onDelete={handleDeleteImage} imageLoading={imageLoading} />
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
                        <Col span={18}>
                            <div className="submitBtn">
                                <Button size='large' type='danger' onClick={handleDeleteProduct} loading={deleteLoading}>Delete</Button>
                                <Button size='large' onClick={() => navigate('/products')}>Cancel</Button>
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

export default ProductSettings;