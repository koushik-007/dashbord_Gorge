import { Button, Skeleton, Tooltip } from "antd";
import { DashOutlined, MenuOutlined } from '@ant-design/icons';
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
    dataIndex: 'image',
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
    dataIndex: 'bundleName',
    className: 'drag-visible',
    width: 600,
    render: (bundleName, record) => {       
      return <div className="cart_table_product">        
        <div className="cart_table_product_details">
          <span>
           {bundleName}
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
      let stock = record.stock - (record.status === "returned" || record.status === "Picked up" ? 0 : record.quantity) ;      
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

