import React, { useState, useEffect, useMemo } from 'react';
import { Spin, Table } from 'antd';
import { columns, items } from './tableHelper';
import './AllOrder.css';
import TableCells from './TableCells';
import { useContext } from 'react';
import { AllOrderDataProvder } from '../../../context/AllOrderDataContext';
import Menu from "../../../components/Menu"

const { Column } = Table;

const AllOrders = ({ activeKey }) => {
    const [data] = useContext(AllOrderDataProvder)
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
    const [dataSource, setDataSource] = useState([])
    useEffect(() => {
        setLoading(true);
        const getData = async () => {
            try {
                const datasource = data.map((doc) => {
                    const { name, firstName, lastName, rentalPeriod, orderNumber, status, price, amount, secuirityDeposit, key } = doc;
                    return {
                        key,
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
                setDataSource(datasource);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        }
        getData();
    }, [data]);

    const filterData = useMemo(() => {
        if (activeKey === 'all') {
            const filter = dataSource.filter((item) => {
                if (item.status === "archived" || item.status === "Canceled") {
                    return false
                }
                return true
            })
            return filter;
        }
        if (activeKey === 'archived') {
            const filter = dataSource.filter((item) => item.status === "archived")
            return filter;
        }
        if (activeKey === 'canceled') {
            const filter = dataSource.filter((item) => item.status === "Canceled")
            return filter;
        }
        if (activeKey === 'upcoming') {
            const filter = dataSource.filter((item) => item.status === "Reserved" || item.status === "Mixed")
            return filter;
        }
        if (activeKey === 'late') {
            const filter = dataSource.filter((item) => {
                if (item.status === "Canceled" || item.status === "archived") {
                    return false;
                }
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
    }, [activeKey, dataSource]);

    return (
        <div>
            {
                loading ?
                    <div className="example">
                        <Spin />
                    </div>
                    :
                    dataSource.length === 0 ?
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
                            {/* <div className='head_table'>
                                <Menu items={items} disabled={!selectedRowKeys.length > 0} type="text" />
                                <p>{selectedRowKeys.length} products selected</p>
                                {
                                    selectedRowKeys.length === 0 ?
                                        <p onClick={handleSelectAll}>Select all {data.length} products</p>
                                        :
                                        <p onClick={() => setSelectedRowKeys([])}>Clear selection</p>
                                }
                            </div> */}
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