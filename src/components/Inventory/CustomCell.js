import { Button, InputNumber, Popover } from "antd";
import { PlusOutlined, MinusOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useState } from "react";
import { doc } from "firebase/firestore";
import { db, editData } from "../../Firebasefunctions/db";

export const CustomCell = ({ record, children, dataIndex,data, setData, productId, ...restProps }) => {
    const [clicked, setClicked] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);
   
    const handleAddStock = async (variationKey, quantity) => {
        console.log(variationKey);
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
            newData.splice(index, 1, {...newObj, id, key});
            //console.log(newData);
            setData(newData)
            setClicked(false);
            setQuantity(0);
            setLoading(false);
        } catch (errInfo) {
            setLoading(false);
            console.log('Validate Failed:', errInfo);
        }
    }
    if (dataIndex === "inventory_add_sub") {
        return <td {...restProps}>
            <Popover
            overlayClassName="inventory_pop"               
                title={<div className="inventory_pop_container">
                    <span>Adjust by</span>
                    <div className="inventory_pop_box">
                        <InputNumber
                            min={-record.stock}
                            size='large'
                            defaultValue={quantity}
                            onChange={(value) => setQuantity(value)}
                            controls={{ upIcon: <PlusOutlined />, downIcon: <MinusOutlined /> }}
                        />
                        <span className="inventory_count"> {record.stock} <ArrowRightOutlined />{quantity + record.stock}</span>
                    </div>
                </div>}
                 content={
                    <>
                        <Button onClick={() => setClicked(false)}>Cancel</Button>
                        <Button loading={loading} disabled={quantity === 0} type="primary" onClick={() => handleAddStock(record.key, quantity)}>{quantity === 0 ? 'Apply' : quantity > 0 ? 'ADD ' + quantity : 'Remove ' + Math.abs(quantity)}</Button>
                    </>
                }
                trigger="click"
                open={clicked}
                onOpenChange={(open) => setClicked(open)}
                placement="left"
                destroyTooltipOnHide={{ keepParent: false }}
            >
                <button><><PlusOutlined /><MinusOutlined /></></button>
            </Popover>
        </td>
    }
    return <td {...restProps}>
        {children}
    </td>
};