import { Skeleton } from 'antd';
import { GrCubes } from "react-icons/gr";

export const columns = [
    {
        key: '1',
        title: '',
        dataIndex: 'image',
        width: 400,
        render: (image, record) => {
            const variants = Object.keys(record.rest);
            return (
                <div className='inventory_table_image'>
                    <div className='imageDiv'>
                        {
                            image ?
                                <span><img src={image} alt="" width="55px" /></span>
                                :
                                <Skeleton.Image active={false} />
                        }
                    </div>
                    <span className='inventory_span'>
                        <div>
                            <GrCubes />
                            <span>{record.productName}</span>
                        </div>
                        <span>
                            {
                                variants.map((item, index) => (<span key={index}>
                                    {index > 0 ? <span> • </span> : null}
                                    {record.rest[item]}
                                </span>
                                ))
                            }
                        </span>
                    </span>
                </div>
            )
        }
    },
    {
        key: '2',
        title: 'Type',
        dataIndex: 'type',
        width: 10,
    },
    {
        key: '3',
        title: 'Available till',
        dataIndex: 'availableTill',
        width: 10,
    },
    {
        key: '4',
        title: 'In stock',
        dataIndex: 'stock',
        width: 10,
    },
]

export const rentalColumns = [
    {
        key: '5',
        title: 'Picked up',
        dataIndex: 'pickedUp',
        width: 10,
    },
    {
        key: '6',
        title: 'Total',
        dataIndex: 'total',
        width: 10,
        render: (_, record) => (
            <>{record.stock - record.pickedUp}</>
        )
    },
]