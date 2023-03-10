import { Modal } from 'antd';
import React from 'react';

const CustomModal = ({ children, isModalOpen, setIsModalOpen, footer, setSelectedKey }) => {
    return (
        <Modal
            destroyOnClose={true}
            closeIcon={''}
            wrapClassName="paymentModalWrap"
            title="Payment"
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => {setIsModalOpen(false);setSelectedKey('')}}            
            footer={footer}
            style={{
                top: -20
            }}
        >
            {
                children
            }
        </Modal>
    );
};

export default CustomModal;