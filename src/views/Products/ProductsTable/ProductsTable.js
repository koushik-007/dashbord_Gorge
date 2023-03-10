import { Button, Skeleton, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaCode, FaCubes } from 'react-icons/fa'
import { ShoppingCartOutlined } from '@ant-design/icons';
import Menu from "../../../components/Menu";
import './ProductsTable.css';
import { useNavigate } from 'react-router-dom';
import { columns, items } from './tableHelper';
import { db, getAllData } from '../../../Firebasefunctions/db';
import { collection } from 'firebase/firestore';


const ProductsTable = () => {

  let navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);

  const productCollectionsRef = collection(db, "product_collections");
  useEffect(() => {
    setLoading(true)
    const getData = async () => {
      const res = await getAllData(productCollectionsRef);
      const data = res.map((doc) => {
        const { product_name, tracking_method, sku, imageUrl } = doc;
        return {
          product_name: <span style={{ display: 'flex' }}> {imageUrl ? <img src={imageUrl} alt="" width="35px" /> : <Skeleton.Image active={false} />} &nbsp; {product_name}</span>,
          key: doc.id,
          name: product_name,
          tracking_method: <> {tracking_method === "Consumable" ? <ShoppingCartOutlined /> : <FaCubes />} &nbsp; {tracking_method}</>,
          sku,
          onlineStore: <Button size='small'><FaCode /> &nbsp; Visible</Button>,
        }
      });
      setData(data);
      setLoading(false)
    }
    getData();
  }, [])

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
  return (
    <div style={data.length < 8 ? { height: '90vh' } : {}}>
      <div className='head_table'>
        <Menu items={items} disabled={!selectedRowKeys.length > 0} type="text" />
        <p
        >
          {selectedRowKeys.length} products selected
        </p>
        {
          selectedRowKeys.length === 0 ? <p onClick={handleSelectAll}>Select all {data.length} products</p> : <p onClick={() => setSelectedRowKeys([])}>
            Clear selection
          </p>
        }

      </div>
      <Table
        size='middle'
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        onRow={(record, rowIndex) =>  ({ onClick: event => navigate(`/products/details/${record.key}/inventory`)})}
      />
    </div>
  );
};

export default ProductsTable;