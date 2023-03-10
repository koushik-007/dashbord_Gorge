import { Skeleton } from "antd";
import Variants from "../Variants/Variants";

export const columns = [
  {
    title: 'Product',
    dataIndex: 'product',
    width: 500,
    render: (product, record) => {
      const { product_name, imageUrl, productCount, id, key, price, dayCount, stock, quantity, pickedUp,variationId,productId, taxProfile, ...rest } = record;      
      return <div className="cart_table_product">
        {record.imageUrl ? <img src={record.imageUrl} alt="product" /> : <Skeleton.Image active={false} />}
        <div className="cart_table_product_details">
          <span>            
            <Variants data={rest} dot={true} />
          </span>
          <span>{stock} available</span>
        </div>
      </div>
    }
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    width: 150,
  },
  {
    title: 'Total',
    dataIndex: 'price',
    key: 'total',
    className: 'cart_table_price',
    width: 100,
  }
];


