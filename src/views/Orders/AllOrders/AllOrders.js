import React, { useState, useEffect, useMemo } from 'react';
import { Spin, Table } from 'antd';
import { columns } from './tableHelper';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../Firebasefunctions/db';
import './AllOrder.css';
import TableCells from './TableCells';
import { useContext } from 'react';
import { AllOrderDataProvder } from '../../../context/AllOrderDataContext';


const { Column } = Table;

const AllOrders = ({ activeKey }) => {
    const [data, setData] = useContext(AllOrderDataProvder)
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleSelectAll = () => {
        data.map(({ key }) => setSelectedRowKeys((curr) => [key, ...curr]))
    }

    const ordersCollectionsRef = collection(db, "orders_collections");
    useEffect(() => {
        setLoading(true);
        const getData = async () => {
            try {
                const q = query(ordersCollectionsRef, orderBy("orderNumber", 'desc'));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map((doc) => {
                    const { name, firstName, lastName, rentalPeriod, orderNumber, status, price, amount, secuirityDeposit } = doc.data();
                    return {
                        key: doc.id,
                        orderNumber,
                        name: <span><div className="avatar">
                            {
                                name &&
                                <div>
                                    {firstName ? firstName[0] + lastName && lastName[0] : name.charAt(0).toUpperCase()}
                                </div>
                            }
                            <b>{name && name}</b>
                        </div>
                        </span>,
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
        getData();
    }, []);

    const filterData = useMemo(() => {
        if (activeKey === 'all') {
            return data;
        }
        if (activeKey === 'upcoming') {
            const filter = data.filter((item) => item.status === "Reserved" || item.status === "Mixed")
            return filter;
        }
        if (activeKey === 'late') {
            const filter = data.filter((item) => {
                if (item.return === "No date") {
                    return false
                }
                let diff = new Date().getTime() - new Date(item.return).getTime();
                if (diff > 0) {
                    return item
                }
            })
            return filter;
        }
    }, [activeKey, data]);

    return (
        <div>
            {
                loading ?
                    <div className="example">
                        <Spin />
                    </div>
                    :
                    data.length === 0 ?
                        filterData.length === 0 ?
                            <div className='addCustomer'>
                                <h1>No results found for the selected filters</h1>
                            </div>
                            :
                            <div className='addCustomer'>
                                <h1>Create your first order</h1>
                                <h2>Create and manage your orders with live availability and automatic pricing calculations.
                                    Then, try reserving, picking up, and returning items on an order to get familiar with the workflow</h2>
                            </div>
                        :
                        <div>
                            <div className='head_table'>
                                {/* <Menu items={items} disabled={!selectedRowKeys.length > 0} type="text" />
                                <p>{selectedRowKeys.length} products selected</p>
                                {
                                    selectedRowKeys.length === 0 ?
                                        <p onClick={handleSelectAll}>Select all {data.length} products</p>
                                        :
                                        <p onClick={() => setSelectedRowKeys([])}>Clear selection</p>
                                } */}
                            </div>
                            <Table
                                className='ordertable'
                                size='middle'
                                bordered
                                loading={loading}
                                rowSelection={rowSelection}
                                dataSource={filterData}
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
                                    columns.map(({ title, dataIndex, render, width, sorter }) => <Column
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

export default AllOrders;