import { Button,Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons'
import "./Menu.css"
const index = ({items,disabled}) => {
  
    return <Dropdown overlayClassName='drop-menu' menu={{
        items: items.map( (data, index) => {
            return  {
                label: data.title,
                key: index,
            }
        })
    }} trigger={['click']} disabled={disabled}>
        <Button className="menuBtn">
            <Space>
                Actions
                <DownOutlined />
            </Space>
        </Button>
    </Dropdown>
}

export default index;