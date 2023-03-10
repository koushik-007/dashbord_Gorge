import { Button, Form, Input, Skeleton, Tooltip } from "antd";
import { DashOutlined, MenuOutlined, SaveOutlined } from '@ant-design/icons';
import { SortableHandle } from 'react-sortable-hoc';
import { FaRegDotCircle } from 'react-icons/fa'
import Variants from "../Variants/Variants";

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: 'grab',
      color: '#999',
    }}
  />
));
export const columns = [
  {
    title: '',
    dataIndex: 'sort',
    width: 30,
    className: 'drag-visible',
    render: () => <DragHandle />,
  },
  {
    title: '',
    dataIndex: 'imgage',
    className: 'product-image drag-visible',
    width: 30,
    render: (imgUrl, record) => {
      return <div>
        {imgUrl ? <img src={imgUrl} alt="product" /> : <Skeleton.Image active={false} />}
      </div>
    }
  },
  {
    title: '',
    dataIndex: 'product_details',
    className: 'drag-visible',
    width: 600,
    render: (product_details, record) => {
      const { pickedUp ,productId, key, variationId, ...rest } = record.rest;         
      return <div className="cart_table_product">        
        <div className="cart_table_product_details">
          <span>
           {product_details} - <Variants data={rest} />
          </span>
          <br/>
          {record.quantity} {record.status}
        </div>
      </div>
    },
  },
  {
    title: 'Available',
    dataIndex: 'available',
    className: 'drag-visible',
    width: 100,
    render: (_, record) => {
      const { pickedUp } = record.rest;
      let stock = record.stock - pickedUp - (record.status === "returned" || record.status === "Picked up" ? 0 : record.quantity) ;      
      return <span className="productAvailablity">
        {
          record.pickupNReturnDate.length > 0 ?
            <Button size='large' className={stock < 0 ? 'short' : stock > 0 ? 'left' : ''} danger={stock < 0}><FaRegDotCircle /> &nbsp;{ stock >= 0 ? stock + ' left' : Math.abs(stock) + ' short' }</Button>
            :
            <Tooltip destroyTooltipOnHide={{ keepParent: false }} overlayClassName='rowBtn' color='#fff' placement="top" title="Select a rental period to see product availablity">
              <Button icon={<DashOutlined />} size='large' />
            </Tooltip>
        }
      </span>
    }
  },
];

export const EditableCell = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  setEditingKey,
  handleCustomCharges,
  loading,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <span className="editCharges">
          <Form.Item
            name='dayCount'
            style={{ margin: 0, width: '80px' }}
            rules={[
              {
                required: true,
                message: `Please Input day!`,
              },
            ]}
          >
            <Input size="large" placeholder="day" />
          </Form.Item>
          <Form.Item
            name='charge'
            style={{ margin: 0, width: '80px' }}
            rules={[
              {
                required: true,
                message: `Please Input price!`,
              },
            ]}
          >
            <Input size="large" placeholder="price" />
          </Form.Item>
          <Button loading={loading} className="chargeEdit" onClick={() => handleCustomCharges(record.orderProductsId)} icon={<SaveOutlined />} size='large' />
        </span>
      ) : (
        children
      )}
    </td>
  );
};