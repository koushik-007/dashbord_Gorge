import { FaBox } from 'react-icons/fa';
import { GiftOutlined } from '@ant-design/icons'

export const items = [
    {
        label: ' Add product',
        link: '/products/new',
        icon: <FaBox/>
    },
    {
        label: 'Add bundle',
        link: '/bundles/new',
        icon: <GiftOutlined/>
    }
]