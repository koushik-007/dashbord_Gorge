import React from 'react';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from "@ant-design/icons";

const BundleDeleteModal = ({ isModalVisible, setIsModalVisible, handleDeleteBundle, isDeleteLoading }) => {
    
    return (
        <Modal
            destroyOnClose={true}
            title={"Delete Product"}
            open={isModalVisible.length > 0}
            onCancel={() => setIsModalVisible('')}
            footer={[
                <Button
                    className='propertyBtn'
                    size='large'
                    key="cancel"
                    onClick={() => { setIsModalVisible('') }}>
                    Cancel
                </Button>,
                <Button
                    loading={isDeleteLoading}
                    onClick={() => {handleDeleteBundle(isModalVisible)}}
                    size='large'
                    danger
                    className='propertyBtn'
                    key="back"
                    type='primary'>
                    Delete product
                </Button>
            ]}
        >
            <div className="deleteVariation">
                <ExclamationCircleOutlined />
                <div>
                    <h4>Are you sure you want to delete this product from this bundle?</h4>
                    <div>This cannot be undone</div>
                </div>
            </div>
        </Modal>
    );
};

export default BundleDeleteModal;