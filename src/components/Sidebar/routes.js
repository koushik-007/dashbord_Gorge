import {
    PlusOutlined,
    DashboardOutlined,
    FileOutlined,
    InboxOutlined,
    CalendarOutlined,
    RightOutlined
  } from '@ant-design/icons';
  import { FaRegUser } from "react-icons/fa";
  import { BiDockTop } from 'react-icons/bi'
export const routes = [
    {
        path: '/orders/new',
        popover: ['New rental order'],
        icon: <PlusOutlined/>
    },
    {
        path: '/',
        popover: ['Dashboard'],
        icon: <DashboardOutlined />
    },
    {
        path: '/orders',
        popover: ['Orders'],
        icon: <InboxOutlined />
    },
    {
        path: '/calendar',
        popover: ['Calendar'],
        icon: <CalendarOutlined />
    },
    {
        path: '/documents',
        popover: ['Documents'],
        icon: <FileOutlined />
    },
    {
        path: '/customers',
        popover: ['Customers'],
        icon: <FaRegUser/>
    },
    {
        path: '/products',
        popover: ['Products'],
        icon: <BiDockTop/>
    },
    {
        path: '/arrow',
        icon: <RightOutlined />,
        popover: [
            {
                name:  'Reports',
                icon: <PlusOutlined/>
            },
            {
                name:  'Reports',
                icon: <PlusOutlined/>
            },
            {
                name:  'Reports',
                icon: <PlusOutlined/>
            },
            {
                name:  'Reports',
                icon: <PlusOutlined/>
            }
        ]
    }
]