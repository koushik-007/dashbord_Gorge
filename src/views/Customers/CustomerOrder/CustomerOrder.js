import { Spin, Table } from 'antd';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../Firebasefunctions/db';
import { columns } from '../../Orders/AllOrders/tableHelper';
import TableCells from './TableCells';

const { Column } = Table;

const CustomerOrder = ({customerId}) => {
    const [loading, setLoading] = useState(false);
    const ordersCollectionsRef = collection(db, "orders_collections");
    const [data, setData] = useState([]);
    useEffect(() => {
        setLoading(true);
        const getData = async () => {
            try {
                const q = query(ordersCollectionsRef, where("customerId", "==", customerId));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc, index) => {
                    const {rentalPeriod, status, price, amount, secuirityDeposit } = doc.data();
                    return {
                        key: doc.id,
                        orderNumber: index + 1,                        
                        status: status && status,
                        pickup: rentalPeriod?.length > 0 ? rentalPeriod[0] : 'No date',
                        return: rentalPeriod?.length > 0 ? rentalPeriod[1] : 'No date',
                        price,
                        amount,
                        secuirityDeposit: secuirityDeposit ? secuirityDeposit : 0
                    }
                });
                setData(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
       if (customerId) {
        getData();
       }
    }, [customerId]);
    return (
        <div>
            {
                loading ?
                    <div className="example">
                        <Spin />
                    </div>
                    :
                    data.length === 0 ?
                            <div className='addCustomer'>
                                <h1>No orders found for this customer</h1>                                
                            </div>
                        :
                        <div>                            
                            <Table
                                className='ordertable'
                                size='middle'
                                bordered
                                loading={loading}
                                dataSource={data}
                                components={{
                                    body: {
                                        cell: TableCells,
                                    },
                                }}
                                scroll={{
                                    x: 1000,
                                    y: 400
                                }}
                            >
                                {
                                    columns.filter((item) => !(item.dataIndex === 'name')).map(({ title, dataIndex, render, width, sorter }) => <Column
                                        key={dataIndex}
                                        title={title}
                                        dataIndex={dataIndex}
                                        render={render}
                                        width={width}
                                        sorter={sorter}
                                        onCell={
                                            (record) => ({
                                                dataIndex,
                                                key: record.key,
                                                record,
                                                routing: dataIndex === 'paymentStatus' ? false : true,
                                            })
                                        }
                                    />)
                                }
                            </Table>
                        </div>
            }

        </div>
    );
};

export default CustomerOrder;