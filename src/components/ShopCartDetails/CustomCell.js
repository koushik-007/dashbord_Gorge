import { Button, InputNumber } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { ImCross } from "react-icons/im";
import { ShopCartProvder } from "../../context/ShopCartContext";
import { useContext } from "react";

export const CustomCell = ({ record, children, dataIndex, dayCount, ...restProps }) => {
    const [cartData, setCartData] = useContext(ShopCartProvder);
    const handleRemoveCart = (selectedkey) => {
        const newcart = cartData.filter(({ key }) => !(key === selectedkey));
        setCartData(newcart);
    }
    const handleProductCount = (value) => {
        if (value == 0) {
           return handleRemoveCart(record.key);
        }
        const newData = [...cartData];
        const index = newData.findIndex(({ key }) => key === record.key);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, productCount: value });
            setCartData(newData);
        }
    }
    if (dataIndex === "quantity") {
        return <td {...restProps}>
            <div className="cart_table_quantity">
                <Button onClick={()=> handleProductCount(record.quantity - 1)} size="large" type="text" icon={<MinusOutlined />} />
                <InputNumber size="large" controls={false} value={record.quantity} />
                <Button onClick={()=> handleProductCount(record.quantity + 1)} size="large" type="text" icon={<PlusOutlined />} />
            </div>
        </td >
    }
    if (dataIndex === "price") {
       return <td {...restProps}>
           <div>
           <span>{record.quantity * parseFloat(record.price) * dayCount}</span>
            <Button onClick={() => handleRemoveCart(record.key)} type='text' size='small' icon={<ImCross />} />
           </div>
        </td>
    }
    return <td {...restProps}>
        {children}
    </td>
};