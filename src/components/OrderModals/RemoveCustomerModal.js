import React from 'react';
import { Button, Modal } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const RemoveCustomerModal = ({ isRemoveCustomerModal, setIsRemoveCustomerModal, isRemoveCustomerLoading, handleRemoveCustomer }) => {
    return (
        <Modal
            destroyOnClose={true}
            title="Remove customer"
            open={isRemoveCustomerModal}
            onCancel={() => setIsRemoveCustomerModal(false)}
            footer={[
                <Button
                    className='propertyBtn'
                    size='large'
                    key="cancel"
                    onClick={() => { setIsRemoveCustomerModal(false); }}>
                    Cancel
                </Button>,
                <Button
                    loading={isRemoveCustomerLoading}
                    onClick={async () => {
                        await handleRemoveCustomer();
                        setIsRemoveCustomerModal(false)
                    }}
                    size='large'
                    danger
                    className='propertyBtn'
                    key="back"
                    type='primary'>
                    Confirm
                </Button>
            ]}
        >
            <div className="deleteVariation">
                <QuestionCircleOutlined />
                <div>
                    <h4>Are you sure you want to remove the customer from this order?</h4>
                </div>
            </div>
        </Modal>
    );
};

export default RemoveCustomerModal;