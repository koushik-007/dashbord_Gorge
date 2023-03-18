import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined } from "@ant-design/icons";
import React from 'react';
import { updateDoc } from 'firebase/firestore';
import { useState } from 'react';

const CancelOrderModal = ({ orderRef, isModalVisible, setIsModalVisible, setOrderData}) => {
    const [isCancelLoading, setIsCancelLoading] = useState(false);
    const handleCancelOrder = async () => {  
        setIsCancelLoading(true);  
        await updateDoc(orderRef, { status: "Canceled" });
        await setOrderData((curr) => ({ ...curr, status: "Canceled" }));
        setIsCancelLoading(false);
        setIsModalVisible(false);
      }
    return (
        <Modal
            destroyOnClose={true}
            title={"Cancel order"}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
                <Button
                    className='propertyBtn'
                    size='large'
                    key="cancel"
                    onClick={() => { setIsModalVisible(false); }}>
                    Cancel
                </Button>,
                <Button
                    loading={isCancelLoading}
                    onClick={handleCancelOrder}
                    size='large'
                    danger
                    className='propertyBtn'
                    key="back"
                    type='primary'>
                    Cancel Order
                </Button>
            ]}
        >
            <div className="deleteVariation">
                <ExclamationCircleOutlined />
                <div>
                    <h4>Are you sure you want to cancel this order?</h4>
                    <div>This cannot be undone</div>
                </div>
            </div>
        </Modal>
    );
};

export default CancelOrderModal;