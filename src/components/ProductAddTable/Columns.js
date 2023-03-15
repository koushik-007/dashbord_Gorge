import { Button, Popover } from "antd"
import { useState } from "react";
import { DownOutlined, EditOutlined } from '@ant-design/icons';

export const ChargeColumn = ({ handleCharges, record, charge, edit, price, requireId }) => {
    const [open, setOpen] = useState(false);
    const hide = () => {
        setOpen(false);
      };
    
      const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
      };
    return <span style={{ display: 'flex' }}>
        <div className="chargeBtn">
            <Popover
                destroyTooltipOnHide={{keepParent:false}}
                placement='bottom'
                overlayClassName='chargeBtnPop'
                content={
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => (
                        <div className='chargeOptions' key={day} onClick={() => {handleCharges(day, requireId, price); setOpen(false)}}>
                            <span>{day} {day === 1 ? 'day' : 'days'}</span>
                            <span>{day * price}</span>
                        </div>
                    ))
                }
                title={<p onClick={hide}>Calculate for rental period</p>}
                trigger="click"
                open={open}
                onOpenChange={handleOpenChange}
                >
                <Button size='large' >
                    <span>{record.dayCount} days</span>
                    <span>{charge} <DownOutlined /></span>
                </Button>
            </Popover>
        </div>
        <Button className='chargeEdit' size='large' onClick={() => edit(record)} icon={<EditOutlined />} />
    </span>
}