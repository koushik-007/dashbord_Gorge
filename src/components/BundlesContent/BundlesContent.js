import { Button, Input, Skeleton, Spin, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import "./BundlesContent.css";
import { FaBoxOpen } from 'react-icons/fa';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { addDocumentData, db, deleteDocument, getAData, getAllData } from '../../Firebasefunctions/db';
import { columns, CustomCell } from './tableHelper';
import BundleDeleteModal from '../BundleModals/BundleDeleteModal';
import { useRef } from 'react';
import { useMemo } from 'react';
import { useDebounce } from '../../customhook/debounce';

const { Column } = Table;
const BundlesContent = ({ BundlesId, bundleData }) => {

  const [data, setData] = useState([])
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setloading] = useState(false);
  const [addproductToBundle, setAddproductToBundle] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState('');
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const productCollectionsRef = collection(db, "product_collections");
  const bundlesProCollRef = collection(db, "bundles_collections", BundlesId, "product_collections");

  const getData = async () => {
    setloading(true)
    const data = await getAllData(productCollectionsRef);
    setData(data);
  }
  const ref = useRef(null);

  function close(e) {
    try {
      if (!ref.current.contains(e.target)) {
        setShowOptions(false);
      }
      else {
        // setShowOptions(true)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const datasource = async () => {
    const productsOfBundle = await getAllData(bundlesProCollRef);
    if (productsOfBundle.length > 0) {
      const configuretableData = productsOfBundle.map((data) => {
        const { imageUrl, product_name, quantity, productId, variation, ...rest } = data;
        return {
          imageUrl: imageUrl,
          product_name,
          quantity,
          BundlesId,
          productId,
          variation,
          ...rest
        }
      });
      setAddproductToBundle(configuretableData);
    }
    setloading(false);
  }
  useEffect(() => {
    getData();
    datasource();
  }, []);

  useEffect(() => {
    document.body.addEventListener('click', close);
  }, [])

  const handleAddToBundle = async (product) => {
    setloading(true);
    setShowOptions(false);
    const { imageUrl, product_name, id } = product;
    const res = await addDocumentData(bundlesProCollRef, { imageUrl, product_name, quantity: 1, productId: id, variation: 'any' });
    await setAddproductToBundle((curr) => ([...curr, {
      imageUrl: product.imageUrl,
      product_name: product.product_name,
      key: res.id,
      id: res.id,
      productId: id,
      quantity: 1,
      variation: 'any'
    }]));
    setloading(false);
  }
  const handleDeleteBundle = async (bundleDocId) => {
    setIsDeleteLoading(true);
    const bundlesDocRef = doc(db, "bundles_collections", BundlesId, "product_collections", bundleDocId);
    await deleteDocument(bundlesDocRef);
    const newData = addproductToBundle.filter(({ key }) => key !== bundleDocId);
    setAddproductToBundle(newData);
    setIsDeleteModalVisible('')
    setIsDeleteLoading(false);
  }

  const handleQuantity = async (value, id) => {
    if (value < 1) {
      return;
    }
    const newData = [...addproductToBundle];
    const index = newData.findIndex((item) => id === item.id);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, quantity: value });
      const bundlesProDocRef = doc(db, "bundles_collections", BundlesId, "product_collections", id);
      await updateDoc(bundlesProDocRef, { quantity: value });
      setAddproductToBundle(newData);
    }
  }
  const [search, setSearch] = useState('');
  const debouncevalue = useDebounce(search, 300);
  const filterData = useMemo(() => {
    if (!debouncevalue || debouncevalue === '') {
      return data
    } else {
      const filtered = data.filter((item) => item?.product_name.toLowerCase().match(debouncevalue.toLowerCase()));
      if (!filtered.length) {
        return []
      } else if (Array.isArray(filtered)) {
        return filtered
      }
    }

  }, [debouncevalue, data]);


  useEffect(() => {
    const setPrice = async () => {
      let sum = 0;
      let stock = []
      for (let i = 0; i < addproductToBundle.length; i++) {
        const item = addproductToBundle[i];
        const { productId, variation, quantity } = item;
        if (variation === 'any') {
          const productDocRef = collection(db, "product_collections", productId, "variations");
          const productData = await getAllData(productDocRef);
          let x = parseFloat(productData[0]?.price) * parseFloat(item.quantity)
          sum += x
          stock.push(parseFloat(productData[0]?.stock ? productData[0]?.stock : 0) / quantity)
        }
        else {
          const variationDocRef = doc(db, "product_collections", productId, "variations", variation);
          const variationD = await getAData(variationDocRef);
          let x = parseFloat(variation?.price) * parseFloat(item.quantity)
          sum += x
          stock.push(parseFloat(variationD?.stock ? variationD?.stock : 0) / quantity)
        }
      }
      const bundleDocRef = doc(db, "bundles_collections", BundlesId);
      if (bundleData?.fixedPrice) {
        await updateDoc(bundleDocRef, { stock: parseInt(stock[0]) });
      }
      else {
        await updateDoc(bundleDocRef, { price: sum, stock: parseInt(stock[0]) });
      }
    }
    setPrice();
  }, [addproductToBundle]);
  return (
    <div className='bundleContent'>
      <div className="bundleContentDropDown" ref={ref}>
        <p>Add bundle product</p>
        <Input onChange={(e) => setSearch(e.target.value)} onClick={() => { setShowOptions(true) }} size="large" placeholder="Search" style={{ borderRadius: '7px' }} prefix={<SearchOutlined className='searchIcon' />} />
        <div className={`dropdownOption ${showOptions ? 'activated' : ''}`}>
          <div className='showingOptions'>
            <p>Showing 1-{data.length} of {data.length}</p>
            {
              data.length === 0 && <Spin size='large' />
            }
          </div>
          {
            filterData.length > 0 ?
              filterData.map((product, index) => {
                const { product_name, imageUrl } = product;
                return (
                  <div className='options' key={index} onClick={() => handleAddToBundle(product)}>
                    <div className="optionImg">
                      {imageUrl ? <img src={imageUrl} alt="" width="35px" /> : <Skeleton.Image active={false} />}&nbsp;&nbsp; <span>{product_name}</span>
                    </div>
                    <div className="addOptionBtn">
                      <button> <PlusOutlined color='white' /> &nbsp;Add to bundle</button>
                    </div>
                  </div>
                )
              })
              :
              <p>No data found</p>
          }
        </div>
      </div>
      {
        addproductToBundle.length > 0 || loading ?
          <div className="addproductToBundle">
            <Table
              loading={loading}
              pagination={false}
              dataSource={addproductToBundle}
              scroll={{
                x: 1000
              }}
              components={{
                body: {
                  cell: CustomCell,
                },
              }}
            >
              {
                columns.map(({ key, dataIndex, title, render, width }) => <Column
                  key={key}
                  title={title}
                  dataIndex={dataIndex}
                  width={width}
                  render={render}
                  onCell={
                    (record) => ({
                      handleQuantity,
                      BundlesId,
                      record,
                      dataIndex,
                      addproductToBundle,
                      setAddproductToBundle
                    })
                  }
                />)
              }
              <Column
                key={6}
                title={''}
                dataIndex='product_details'
                width={100}
                render={(_, record) => (
                  <>
                    <Button danger type="primary" onClick={() => setIsDeleteModalVisible(record.key)}>Remove</Button>
                  </>

                )}
              />
            </Table>
          </div>
          :
          <div className="emptyBox">
            <div>
              <FaBoxOpen />
            </div>
            <div>
              <h2>This bundle is empty.</h2>
              <p>Please add some products.</p>
            </div>
          </div>
      }
      <BundleDeleteModal
        isModalVisible={isDeleteModalVisible}
        setIsModalVisible={setIsDeleteModalVisible}
        handleDeleteBundle={handleDeleteBundle}
        isDeleteLoading={isDeleteLoading}
      />
    </div>
  );
};

export default BundlesContent;