import { FaBox } from 'react-icons/fa';
import { GiftOutlined } from '@ant-design/icons'

export const items = [
    {
        label: ' Add product',
        link: '/dashboard/products/new',
        icon: <FaBox/>
    },
    {
        label: 'Add bundle',
        link: '/dashboard/bundles/new',
        icon: <GiftOutlined/>
    }
]