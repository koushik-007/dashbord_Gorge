import React, { useState, useContext, useEffect } from 'react';
import { Button, Dropdown, Layout, Typography, Row, Col } from 'antd';
import { SaveOutlined, DashOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons';
import { FaLevelUpAlt } from 'react-icons/fa';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { addDocumentData, db, getAData, getAllData } from '../../../Firebasefunctions/db';
import Header from '../../../components/Header';
import "./AddOrder.css";
import { items } from './items';
import { Link, useNavigate } from 'react-router-dom';
import CustomerForm from '../../../components/Orderforms/CustomerForm';
import CustomInfoAdd from '../../../components/Orderforms/CustomInfoAdd';
import AddInfoModal from '../../../components/OrderModals/AddInfoModal';
import ProductSearch from '../../../components/ProductsSearch/ProductSearch';
import ProductAddTable from '../../../components/ProductAddTable/ProductsAddTable';
import empty from '../../../images/favicon.ico';
import OrderInvoic from '../../../components/OrderInvoice/OrderInvoic';
import { PriceContextProvider } from '../../../context/PriceContext';
import moment from 'moment';
import ProductShortageModal from '../../../components/OrderModals/ProductShortageModal';
import PickupModal from '../../../components/OrderModals/PickupModal';
import BundleAddTable from '../../../components/BundleAddTable/BundleAddTable';


const { Title } = Typography;
const { Content } = Layout;

const AddOrder = ({ oData }) => {
  const { price, setPrice } = useContext(PriceContextProvider);
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pickupNReturnDate, setPickupNReturnDate] = useState([]);
  const [orderData, setOrderData] = useState(oData ? { ...oData } : {});
  const [isRemoveCustomerLoading, setIsRemoveCustomerLoading] = useState(false);
  const [customInformation, setCustomInformation] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState({ dataType: 'singleLine' });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [loadingProductTable, setLoadingProductTable] = useState(false);
  const [products, setProducts] = useState([]);
  const [bundleData, setBundleData] = useState([]);
  const [shortageProducts, setShortageProducts] = useState([])
  const [isOpenShortageModal, seIsOpenShortageModal] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const productCollectionsRef = collection(db, "product_collections");
  const [pickupLoading, setPickupLoading] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);

  const getData = async () => {
    const data = await getAllData(productCollectionsRef);
    setProducts(data);
  }
  useEffect(() => {
    getData();
  }, []);
  const handleDate = (dateString) => {
    if (dateString[0]?.length > 0) {
      setPickupNReturnDate(dateString);
    }
    else {
      setPickupNReturnDate([]);
    }
  }
  const handleAddCustomer = async (customerData) => {
    await Object.keys(customerData).forEach(key => customerData[key] === undefined ? delete customerData[key] : {});
    setOrderData((curr) => ({ ...curr, ...customerData }));
  }
  const ordersCollectionsRef = collection(db, "orders_collections");
  const handleCreateOrder = async (status) => {
    try {
      setLoading(true);
      if (status === 'Reserved') {
        const isShortage = productsData.filter((data) => data.stock - data.quantity < 0);
        const isShortageBundle = bundleData.filter((data) => data.stock - data.quantity < 0);
        if (isShortage.length > 0 || isShortageBundle.length > 0) {
          setShortageProducts([...isShortage, ...isShortageBundle]);
          setLoading(false);
          return seIsOpenShortageModal(true);
        }
      }
      else {
        const data = await getAllData(ordersCollectionsRef);
        const orderPicks = pickupNReturnDate.length > 0 ? pickupNReturnDate : '';
        const order = { ...orderData, rentalPeriod: orderPicks, status, price, orderNumber: data.length + 1, amount: 0, secuirityDeposit: 0 }
        const res = await addDocumentData(ordersCollectionsRef, order);
        const { id } = res;
        if (customInformation.length > 0) {
          const customInfoRef = collection(db, "orders_collections", id, 'customInformation');
          for (let i = 0; i < customInformation.length; i++) {
            const info = customInformation[i];
            await addDocumentData(customInfoRef, info);
          }
        }
        if (productsData.length > 0) {
          const productRef = collection(db, "orders_collections", id, 'products');
          for (let i = 0; i < productsData.length; i++) {
            const { product_name, imageUrl, productId, variationId, quantity, dayCount, charge } = productsData[i];
            await addDocumentData(productRef, { product_name, imageUrl, productId, variationId, quantity, dayCount, charge, status });
          }
        }
        if (bundleData.length > 0) {
          for (let i = 0; i < bundleData.length; i++) {
            const orderBundleDocRef = collection(db, "orders_collections", res?.id, 'bundles');
            const { bundleId, quantity, dayCount, charge } = bundleData[i];
              const bundleInfo = { bundleId, quantity, dayCount, charge, status }
              await addDocumentData(orderBundleDocRef, bundleInfo);              
            }
          }        
        navigate(`/orders/${id}`)
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  const handleRemoveCustomer = () => {
    setIsRemoveCustomerLoading(true);
    const { customerId, email, name, firstName, lastName, ...restData } = orderData;
    setOrderData(restData);
    setIsRemoveCustomerLoading(false);
  }

  const hanldeDeleteCustomInfo = (id) => {
    const index = customInformation.findIndex((data) => data.id === id);
    customInformation.splice(index, 1);
    setShowInfoModal(false);
  }

  const handleAddCustomInfo = async (values) => {
    setCustomInformation((curr) => ([...curr, { ...values, id: Math.random() * 10 }]));
    setShowInfoModal(false)
  }

  const handleEditInfo = async (values) => {
    const newData = customInformation.map((data) => {
      if (data.id === selectedInfo.id) {
        return values;
      }
      return data
    })
    setCustomInformation(newData)
    setShowInfoModal(false);
  }

  const handleAddProductData = (products) => {
    const { id, price, ...rest } = products;
    const diff = moment(pickupNReturnDate[1]).diff(moment(pickupNReturnDate[0]), 'days');
    const productInfo = { variationId: id, quantity: 1, dayCount: diff > 0 ? diff : 1, charge: diff > 0 ? (diff * price) : price, orderProductsId: Math.random(), price, status: orderData?.status ? orderData?.status : 'Çoncept' }
    setProductsData((curr) => ([...curr, { ...productInfo, ...rest }]));
    setShowProducts(false);
  }
  const handleDeleteProduct = (record) => {
    const newData = productsData.filter((item, index) => index !== record.key);
    setProductsData(newData);
  };
  const handleAddBundleData = async (bundleData) => {
    setLoadingProductTable(true);
    setShowProducts(false)
    const { id, bundleName, imageUrl, ...rest } = bundleData;
    const diff = moment(pickupNReturnDate[1]).diff(moment(pickupNReturnDate[0]), 'days');
    const bundleInfo = { bundleId: id, quantity: 1, dayCount: diff > 0 ? diff : 1, charge: diff > 0 ? (diff * 50) : 60, status: orderData?.status === 'Concept' ? 'Concept' : "Reserved" }
    setBundleData((curr) => ([...curr, { ...bundleInfo, bundleName, imageUrl, orderBundleId: Math.random(), ...rest }]));
    setLoadingProductTable(false);
  }

  const handleDeleteBundle = async (record) => {
    setLoadingProductTable(true);
    const newData = bundleData.filter((item, index) => item.orderBundleId !== record.orderBundleId);
    setBundleData(newData);
    setLoadingProductTable(false);
  };
  const handlepickUp = async (selectedIds, bundleSelectedIds, stat) => {
    setPickupLoading(true);
    let isShortage = []
    selectedIds.forEach((id) => {
      const data = productsData.find(data => data.orderProductsId === id);
      if (data?.stock - data?.quantity < 0) {
        isShortage.push({ ...data, isBundle: false });
      }
    });
    bundleSelectedIds.forEach((id) => {
      const data = bundleData.find(data => data.orderBundleId === id);
      if (data?.stock - data?.quantity < 0) {
        isShortage.push({ ...data, isBundle: true });
      }
    });
    if (isShortage.length > 0) {
      setShortageProducts(isShortage);
      setLoading(false);
      setPickupLoading(false);
      return seIsOpenShortageModal(true);
    }
    else {
      setPickupLoading(true);
      const status = selectedIds.length === productsData.length && bundleSelectedIds.length === bundleData.length ? 'Picked up' : 'Mixed';
      const data = await getAllData(ordersCollectionsRef);
      const orderPicks = pickupNReturnDate.length > 0 ? pickupNReturnDate : '';
      const order = { ...orderData, rentalPeriod: orderPicks, status, price, orderNumber: data.length, amount: 0, securityDeposite: 0 }
      const res = await addDocumentData(ordersCollectionsRef, order);

      if (customInformation.length > 0) {
        const customInfoRef = collection(db, "orders_collections", res?.id, 'customInformation');
        for (let i = 0; i < customInformation.length; i++) {
          const info = customInformation[i];
          await addDocumentData(customInfoRef, info);
        }
      }
      for (let i = 0; i < productsData.length; i++) {
        const productRef = collection(db, "orders_collections", res?.id, 'products');
        const { product_name, imageUrl, productId, variationId, quantity, dayCount, charge, orderProductsId } = productsData[i];
        const variationDoc = doc(db, "product_collections", productId, 'variations', variationId);
        if (selectedIds.includes(orderProductsId)) {
          await addDocumentData(productRef, { product_name, imageUrl, productId, variationId, quantity, dayCount, charge, status: 'Picked up' });
          const data = await getAData(variationDoc);
          await updateDoc(variationDoc, { pickedUp: parseFloat(data?.pickedUp) + parseFloat(quantity) });
        }
      }
      for (let i = 0; i < bundleData.length; i++) {
        const orderBundleDocRef = collection(db, "orders_collections", res?.id, 'bundles');
        const { bundleId, orderBundleId, quantity, dayCount, charge } = bundleData[i];
        const bundleDocRef = doc(db, "bundles_collections", bundleId);
        if (bundleSelectedIds.includes(orderBundleId)) {
          const bundleInfo = { bundleId, quantity, dayCount, charge, status: 'Picked up' }
          await addDocumentData(orderBundleDocRef, bundleInfo);
          const data = await getAData(bundleDocRef);
          await updateDoc(bundleDocRef, { pickedUp: parseFloat(data?.pickedUp) + parseFloat(quantity) });
        }
      }
      setPickupLoading(false);
      setShowPickupModal(false);
      navigate(`/orders/${res?.id}`)
    }
  }
  return (
    <>
      <Header>
        <div className='order-header'>
          <Title>Order</Title>
          <div className='order-btn'>
            <div className='header-dropdown'>
              <Button loading={loading} onClick={() => handleCreateOrder('Concept')} ><SaveOutlined /> &nbsp;
                <span> Save as concept</span>
              </Button>
              <div className='header-dropdown-menu'>
                <p>Save this order without reserving items.</p>
              </div>
            </div>

            {
              pickupNReturnDate.length > 0 ?
                <>
                  {
                    productsData.length > 0 ?
                      <div className='reserveNPickup'>
                        <Button icon={<LockOutlined />} loading={loading} type='primary' size='large' onClick={() => handleCreateOrder('Reserved')}>Reserve</Button>
                        <Button icon={<FaLevelUpAlt />} type='primary' danger size='large' onClick={() => setShowPickupModal(true)}> Pick up items</Button>
                      </div>
                      :
                      <Button icon={<LockOutlined />} loading={loading} type='primary' size='large' onClick={() => handleCreateOrder('Reserved')}>Reserve</Button>

                  }
                </>
                :
                null
            }
            <div className='order-btn-options'>
              <Dropdown overlayClassName='order-btn-options-dropdown' menu={{ items }} trigger={['click']} arrow={true}>
                <Button icon={<DashOutlined />} size='large' />
              </Dropdown>
            </div>

          </div>
        </div>
      </Header>
      {
        products.length > 0 || bundleData?.length > 0 ?
          <Content className='main_content' >
            <Row gutter={[24, 8]}>
              <CustomerForm
                isRemoveCustomerLoading={isRemoveCustomerLoading}
                orderData={orderData}
                handleRemoveCustomer={handleRemoveCustomer}
                pickupNReturnDate={pickupNReturnDate}
                handleDate={handleDate}
                handleAddCustomer={handleAddCustomer}
              />
              <CustomInfoAdd
                customInformation={customInformation}
                setSelectedInfo={setSelectedInfo}
                setShowInfoModal={setShowInfoModal}
              />
              <Col span={24} xs={24} style={{ paddingBottom: '5rem' }}>
                <div className='product-box'>
                  <div className="product-info">
                    <ProductSearch handleAddProductData={handleAddProductData} handleAddBundleData={handleAddBundleData} showProducts={showProducts} setShowProducts={setShowProducts} />
                    {
                      productsData.length > 0 ?
                        <div className="product-details">
                          {
                            productsData.length > 0 &&
                            <ProductAddTable
                              loadingProductTable={loadingProductTable}
                              productsData={productsData}
                              handleDeleteProduct={handleDeleteProduct}
                              setProductsData={setProductsData}
                              pickupNReturnDate={pickupNReturnDate}
                            />
                          }
                          {
                            bundleData.length > 0 &&
                            <BundleAddTable
                              showHeader={productsData.length === 0}
                              loadingBundleTable={loadingProductTable}
                              bundleData={bundleData}
                              handleDeleteBundle={handleDeleteBundle}
                              setBundleData={setBundleData}
                              pickupNReturnDate={pickupNReturnDate}
                            />
                          }
                        </div>
                        :
                        <div className="no-info">
                          <img src={empty} alt="" style={{ marginBottom: '1rem' }} />
                          <p>This order is empty. Get started by adding some products or a custom line.</p>
                        </div>
                    }
                  </div>
                  <div className="product-invoice">
                    <OrderInvoic productsData={productsData} />
                  </div>
                </div>
              </Col>
            </Row>
          </Content>
          :
          <div className="noProducts">
            <h1>You don't have any products yet</h1>
            <p>Start by adding a product to your inventory</p>
            <Link to='/products/new' className="btn primary"><PlusOutlined /> &nbsp; Add your first product</Link>
          </div>
      }

      <AddInfoModal
        info={selectedInfo}
        showInfoModal={showInfoModal}
        setShowInfoModal={setShowInfoModal}
        hanldeDelete={hanldeDeleteCustomInfo}
        handleSaveInfo={handleAddCustomInfo}
        handleEditInfo={handleEditInfo}
      />
      <ProductShortageModal
        isShowModal={isOpenShortageModal}
        setIsShowModal={seIsOpenShortageModal}
        dataSource={shortageProducts}
      />

      <PickupModal
        isNewOrder={true}
        showPickupModal={showPickupModal}
        setShowPickupModal={setShowPickupModal}
        productsData={productsData}
        pkLoading={pickupLoading}
        bundleData={bundleData}
        handlepickUpNew={handlepickUp}
        setBundleData={setBundleData}
        setProductsData={setProductsData}
        setLoadingProductTable={setLoadingProductTable}
      />
    </>
  );
};

export default AddOrder;