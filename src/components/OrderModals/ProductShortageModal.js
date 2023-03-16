import { Button, Modal, Table } from 'antd';
import React from 'react';
import { useMemo } from 'react';
import { FaTimesCircle } from "react-icons/fa";
import Variants from '../Variants/Variants';

const columns = [
    {
        key: 1,
        title: 'Product',
        dataIndex: 'product',
        render: (product, record) => {
            return <span> {product} {record?.isBundle ? '' : <>
            -
            <Variants data={record?.rest}/>
            </>}</span>
        }
      },
      {
        key: 2,
        title: 'Issue',
        dataIndex: 'issue',
      },
      
]

const ProductShortageModal = ({isShowModal, setIsShowModal, dataSource}) => {    
    const data = useMemo(()=> {
        const data = dataSource.map((item, index) => {
            if (item?.isBundle) {
                const {bundleName, stock, quantity} = item;
                return {
                    key: index,
                    product: bundleName,
                    issue: <span>{Math.abs(stock - quantity)} short</span>,
                    isBundle: true
                }
            }
            const {charge,id, dayCount,imageUrl,key,orderProductsId,pickedUp,price,productId,product_name,quantity,status,stock,variationId, ...rest} = item;
             return {
                key: index,
                product: product_name,
                issue: <span>{Math.abs(stock - quantity)} short</span>,
                isBundle: false,
                rest
            }
        })
        return data
    }, [dataSource])
    return (
        <Modal
        destroyOnClose={true}
        open={isShowModal}
        title="Shortage"
        onCancel={() => setIsShowModal(false)}
        style={{top: -20}}
        footer={[
            <Button
                className='propertyBtn'
                size='large'
                key="cancel"
                onClick={() => setIsShowModal(false)}
            >
                Cancel
            </Button>
        ]}
    >
        <div className="deleteVariation">
                <FaTimesCircle />
                <div>
                    <h4>Shortage error</h4>
                    <div>This will exceed the shortage limit.</div>
                </div>
            </div>
            <Table        
            style={{marginTop: '2rem'}}        
                pagination={false}
                dataSource={data}
                columns={columns}                        
            />
    </Modal>
    );
};

export default ProductShortageModal;