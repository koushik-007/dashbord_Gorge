import React, { useState } from 'react';
import { Button, DatePicker, InputNumber, Modal, Select } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { doc } from 'firebase/firestore';
import { db, editData } from '../../Firebasefunctions/db';

const { Option } = Select;

const InventoryModal = ({ isModalVisible, setIsModalVisible, data, setData, productName, productId }) => {    
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedVariantKey, setSelectedVariantKey] = useState(data[0]?.id);

    const handleAddStock = async (variationKey, quantity) => {
        try {
            setLoading(true);
            const newData = [...data];
            const index = newData.findIndex((item) => variationKey === item.key);
            if (index < 0) {
                return
            }
            const item = newData[index];
            const { stock, id, key, ...rest } = item;            
            const newObj = { ...rest, stock: parseFloat(stock ? stock : 0) + parseFloat(quantity) }
            const variationDoc = doc(db, "product_collections", productId, 'variations', variationKey);
            await editData(variationDoc, newObj);
            newData.splice(index, 1, {...newObj, key, id} );
            //console.log(newData);
            setData(newData);
            setLoading(false);
            setIsModalVisible(false);
        } catch (errInfo) {
            setLoading(false);
            console.log('Validate Failed:', errInfo);
        }
    }
    return (
        <Modal
            wrapClassName="inventory_modal"
            destroyOnClose={true}
            title='Add stock items'
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
                    loading={loading}
                    className='propertyBtn'
                    size='large'
                    key="submit"
                    type="primary"
                    onClick={()=> handleAddStock(selectedVariantKey, quantity)}
                >
                    Add {quantity} stock {quantity > 1 ? 'items' : 'item'}
                </Button>,
            ]}
        >
            <div className="inventory_modal_container">
                <div className="inventory_modal_box">
                    <div className='inventory_modal_sub_box'>
                        <label >Quantity</label>
                        <InputNumber
                            min={1}
                            size='large'
                            defaultValue={quantity}
                            onChange={(value) => setQuantity(value)}
                            controls={{ upIcon: <PlusOutlined />, downIcon: <MinusOutlined /> }}
                        />
                    </div>
                    <div className='inventory_modal_sub_box'>
                        <label >Variation</label>
                        <Select
                            value={selectedVariantKey}
                            size='large'
                            showSearch
                            onChange={(value)=> setSelectedVariantKey(value)}
                        >
                            {
                                data.map((obj, index) => {
                                    const { id, key, price, stock, pickedUp, ...rest } = obj;
                                    const variants = Object.keys(rest)
                                    return (
                                        <Option key={key} value={id}>
                                            {productName} -
                                            {
                                                variants.map((item, index) => (<span key={index}> {rest[item]} {variants.length === index + 1 ? null: ' ,'}</span>))
                                            }
                                        </Option>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>
                <hr />
                <div className="inventory_modal_box">
                    <div className='inventory_modal_sub_box'>
                        <label >Available from</label>
                        <DatePicker
                            size='large'
                            showTime={{ format: 'hh:mm A', use12Hours: true }}
                            format={['YYYY-MM-DD hh:mm A']}
                            placeholder='Immediately'
                        />
                    </div>
                    <div className='inventory_modal_sub_box'>
                        <label >Available till</label>
                        <DatePicker
                            size='large'
                            showTime={{ format: 'hh:mm A', use12Hours: true }}
                            format={['YYYY-MM-DD hh:mm A']}
                            placeholder='No end date'
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default InventoryModal;