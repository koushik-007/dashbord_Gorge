import React from 'react';
import { Button, Modal } from 'antd';
import InfoForm from '../Forms/InfoForm';
import AddressForm from '../Forms/AddressForm';

const AddCustomerModal = ({setCustomerDetails, customerDetails, isModalVisible, setIsModalVisible, handleCreateCustomer, loading}) => {
    return (
        <Modal
        destroyOnClose={true}
        className='orderModal'
        footer={[
            <Button
                className='propertyBtn'
                size='large'
                key="cancel"
                onClick={() => setIsModalVisible(false)}>
                Cancel
            </Button>,
            <Button
                loading={loading}
                className='propertyBtn'
                size='large'
                key="submit"
                type="primary"
                disabled={customerDetails?.name.length < 1 || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(customerDetails?.email))}
                onClick={handleCreateCustomer}
            >
                Save
            </Button>,
        ]}
        title={"Create customer"}
        open={isModalVisible} onCancel={() => { setIsModalVisible(false); }}
        style={{ top: '5%' }}>
        <div style={{ paddingTop: '4rem' }}>
            <InfoForm customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} />
        </div>
        <div style={{ paddingTop: '1.2rem' }}>
            <AddressForm customerDetails={customerDetails} setCustomerDetails={setCustomerDetails} />
        </div>
    </Modal>
    );
};

export default AddCustomerModal;