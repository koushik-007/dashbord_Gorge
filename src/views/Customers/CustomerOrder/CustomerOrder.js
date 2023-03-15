import { Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AllOrderDataProvder } from '../../../context/AllOrderDataContext';
import { columns } from '../../Orders/AllOrders/tableHelper';
import TableCells from './TableCells';

const { Column } = Table;

const CustomerOrder = ({customerId}) => {
    const [data] = useContext(AllOrderDataProvder)
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        setLoading(true);
        const getData = async () => {
            try {
                const filterData = data.filter((item) => item.customerId === customerId).map((doc, index) => {
                    const {rentalPeriod, status, price, amount, secuirityDeposit, key } = doc;
                    return {
                        key,
                        orderNumber: index + 1,                        
                        status: status && status,
                        pickup: rentalPeriod?.length > 0 ? rentalPeriod[0] : 'No date',
                        return: rentalPeriod?.length > 0 ? rentalPeriod[1] : 'No date',
                        price,
                        amount,
                        secuirityDeposit: secuirityDeposit ? secuirityDeposit : 0
                    }
                });               
                setDataSource(filterData)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
       if (customerId) {
        getData();
       }
    }, [customerId, data]);
    return (
        <div>
            {
                loading ?
                    <div className="example">
                        <Spin />
                    </div>
                    :
                    dataSource.length === 0 ?
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
                                dataSource={dataSource}
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