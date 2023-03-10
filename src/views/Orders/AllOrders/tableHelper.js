import { ArrowRightOutlined, CreditCardOutlined, PlusOutlined } from '@ant-design/icons';
import { FaRegPaperPlane } from 'react-icons/fa';

export const items = [
  {
    key: '1',
    title: 'Edit products',
  },
  {
    key: '2',
    title: 'Edit tags'
  },
  {
    key: '3',
    title: 'Edit categories'
  },
  {
    key: '4',
    title: 'Generate barcodes'
  }
];
export const columns = [
  {
    title: '#',
    dataIndex: 'orderNumber',
    width: 50,
    render: (orderNumber) => <span>#{orderNumber} </span>,
    sorter: (a, b) => a.orderNumber - b.orderNumber,
  },
  {
    title: 'Customer',
    dataIndex: 'name',
    width: 270,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 130,
    clssName: 'status',
    render: (text) => {
      return <button className={ text.toLowerCase().split(" ")[0] } >{text}</button>
    }
  },
  {
    title: 'Pickup',
    dataIndex: 'pickup',
    render: (text) => {
      return <span className='pickup'>{text} <ArrowRightOutlined /></span>
    },
    width: 200,
  },
  {
    title: 'Return',
    dataIndex: 'return',
    width: 200,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    sorter: (a, b) => a.amount - b.amount,
    width: 60,
  },
  {
    title: "Payment Status",
    dataIndex: "paymentStatus",
    width: 220
  }
];

export const paymentItems =[
  {
    label: 'Manual',
    key: '0',
    icon: <PlusOutlined />
  },
  // {
  //   label: 'Credit card',
  //   key: '1',
  //   icon: <CreditCardOutlined />
  // },
  // {
  //   label: 'Payment request',
  //   key: '2',
  //   icon: <FaRegPaperPlane />
  // },
]