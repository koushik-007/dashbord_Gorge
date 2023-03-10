import { Button, Skeleton, Table } from 'antd';
import { collection } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { FaCode } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { db, getAllData } from '../../../Firebasefunctions/db';
import "./BundlesTable.css"

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.bundleName.length - b.bundleName.length
  },
  {
    title: 'Online store',
    dataIndex: 'onlineStore',
  },
];

const BundlesTable = () => {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const bundlesCollectionsRef = collection(db, "bundles_collections");
  useEffect(() => {
    setLoading(true)
    const getData = async () => {
      const res = await getAllData(bundlesCollectionsRef);
      const data = res.map((doc) => {
        const { bundleName, imageUrl } = doc;
        return {
          bundleName: bundleName,
          name:<span style={{ display: 'flex' }}> {imageUrl ? <img src={imageUrl} alt="" width="35px" /> : <Skeleton.Image active={false} />} &nbsp; {bundleName}</span>,           
          key: doc.id,
          onlineStore: <Button size='small'><FaCode /> &nbsp; Visible</Button>
        }
      });
      setData(data);
      setLoading(false)
    }
    getData();
  }, [])
  return (
    <div style={data.length < 8 ? { height: '100vh' } : {}}>
      <Table
        loading={loading}
        className='bundlesTable'
        size='middle'
        columns={columns}
        dataSource={data}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => navigate(`/bundles/details/${record.key}/content`)
          };
        }}
      />
    </div>
  );
};

export default BundlesTable;