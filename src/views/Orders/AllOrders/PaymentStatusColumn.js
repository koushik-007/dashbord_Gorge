import React, { useState } from 'react';
import { Dropdown } from 'antd';
import { UpOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import { FiRotateCcw } from 'react-icons/fi';
import { paymentItems as items } from './tableHelper';
import PaymentModal from '../../../components/PaymentModal/PaymentModal';

const PaymentStatusColumn = ({ record }) => {
    const [isUpSideArrow, setIsUpSideArrow] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState('');
    const handlePaymentModal = (key) => {
        setIsModalOpen(true)
        setSelectedKey(key)
    }
    const { price, amount } = record
    let outstanding = price - amount;

    return (
        <div className='paymentStatus'>
            <Dropdown.Button
                className={outstanding === 0 ? 'paid' : outstanding === price ? 'overpaid' : 'due'}
                onOpenChange={isVisible => {
                    if (outstanding > 0) {
                        setIsUpSideArrow(isVisible)
                    }
                }}
                icon={isUpSideArrow ? <UpOutlined style={{ fontSize: '15px' }} /> : <DownOutlined style={{ fontSize: '15px' }} />}
                menu={{
                    className: 'paymentStatusDropdown',
                    onClick: ({ key }) => {
                        if (outstanding > 0) {
                            setIsUpSideArrow(false); handlePaymentModal(key)
                        }
                    },
                    items,
                }}
                onClick={() => {
                    if (outstanding > 0) {
                        setIsModalOpen(true)
                    }
                }}
                trigger={['click']}
                type="primary"
                size='large'
                placement='bottomRight'
            >
                {

                    outstanding === 0 ?
                        <span><PlusOutlined /> Paid</span>
                        :
                        outstanding === price ?
                            <span><FiRotateCcw /> Payment due</span>
                            :
                            <span><PlusOutlined /> Partially paid</span>
                }
            </Dropdown.Button>
            <PaymentModal
                orderData={record}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                key={record.key}
                selectedKey={selectedKey}
                setSelectedKey={setSelectedKey}
            />
        </div>
    );
};

export default PaymentStatusColumn;