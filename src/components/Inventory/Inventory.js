import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Tabs } from 'antd';
import { columns, rentalColumns } from './TableHelper';
import "./Inventory.css";
import InventoryModal from './InventoryModal';
import { CustomCell } from './CustomCell';

const { Option } = Select;
const { Column } = Table;

const Inventory = ({ productName, imageUrl, data, tracking_method, setData, productId }) => {
    const [inventoryData, setInventoryData] = useState([])
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [variationType, setVariationType] = useState('all');
    const [stock, setStock] = useState(0)
    // const inventory = useMemo(()=> data.filter(({}) => ), [variationType]);
    useEffect(() => {
        setLoading(true);
        const newData = data.map(({ id, key, price, stock, pickedUp, product_name, ...rest }) => {
            return {
                key: id,
                image: imageUrl,
                type: 'Regular',
                availableTill: 'No end date',
                productName,
                stock,
                pickedUp,
                rest,
            }
        });
        setInventoryData(newData);
        const stocks = data.map(data => parseFloat(data.stock));
        var total = stocks.reduce((a, b) => a + b, 0);
        setStock(total)
        setLoading(false);
    }, [data]);

    return (
        <div className='inventory_content'>
            <Tabs defaultActiveKey="1" items={[
                {
                    label: `Current stock(${stock})`,
                    key: '1',
                    children: <>
                        <div className="type_add_inventory">
                            <Select
                                defaultValue="all"
                                size='large'
                                onChange={(value) => setVariationType(value)}
                                showSearch
                            >
                                <Option value="all">All variations</Option>
                                {
                                    data.map((obj) => {
                                        const { id, key, price, stock, pickedUp, product_name, ...rest } = obj;
                                        let text = "";
                                        for (let x in rest) {
                                            text += rest[x] + ' ';
                                        }
                                        return <Option key={key} value={text}>
                                            {productName} - {text}
                                        </Option>                                        
                                    })
                                }
                            </Select>
                            <Select
                                defaultValue="all"
                                size='large'
                                onChange={() => { }}
                                showSearch
                            >
                                <Option value="all">All types</Option>
                                <Option value="regular">Regular</Option>
                                <Option value="temporary">Temporary</Option>
                            </Select>
                            <Button onClick={() => setIsModalVisible(true)} type='primary' size='large'>Add stock</Button>
                        </div>
                        <Table
                            loading={loading}
                            pagination={false}
                            dataSource={inventoryData}
                            components={{
                                body: {
                                    cell: CustomCell,
                                },
                            }}
                            scroll={{
                                x: 800
                            }}
                        >
                            {
                                columns.map(({ title, dataIndex, width, render }) => <Column
                                    key={dataIndex}
                                    title={title}
                                    dataIndex={dataIndex}
                                    width={width}
                                    render={render}
                                />)
                            }
                            {
                                tracking_method === "Rental product" ?
                                    rentalColumns.map(({ title, dataIndex, width, render }) => <Column
                                        key={dataIndex}
                                        title={title}
                                        dataIndex={dataIndex}
                                        width={width}
                                        render={render}
                                    />)
                                    :
                                    null
                            }
                            <Column
                                title=''
                                dataIndex='inventory_add_sub'
                                className="inventory_add_sub"
                                width={10}
                                onCell={
                                    (record) => ({
                                        dataIndex: 'inventory_add_sub',
                                        record,
                                        setData,
                                        data,
                                        productId
                                    })
                                }
                            />
                        </Table>
                    </>,
                },
                {
                    label: "Expected stock (0)",
                    key: '2',
                    children: `stock 0`
                }
            ]}
            />
            <InventoryModal productName={productName} data={data} setData={setData} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} productId={productId} />
        </div>
    );
};

export default Inventory;