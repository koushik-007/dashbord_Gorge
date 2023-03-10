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
    sorter: (a, b) => a - b,
    width: 50,
  },
  {
    title: 'Customer',
    dataIndex: 'name',
    sorter: (a, b) => a - b,
    width: 270,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sorter: (a, b) => a - b,
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
    sorter: (a, b) => a - b,
    width: 200,
  },
  {
    title: 'Return',
    dataIndex: 'return',
    sorter: (a, b) => a - b,
    width: 200,
  },
  {
    title: 'Price',
    dataIndex: 'price',
    sorter: (a, b) => a - b,
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