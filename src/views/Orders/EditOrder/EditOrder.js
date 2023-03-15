import React, { useEffect, useState } from 'react';
import { Button, Col, Dropdown, Layout, Row, Typography } from 'antd';
import { DashOutlined, LockOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaLevelUpAlt } from 'react-icons/fa';
import Header from '../../../components/Header';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { addDocumentData, db, deleteDocument, getAData, getAllData } from '../../../Firebasefunctions/db';
import CustomerForm from '../../../components/Orderforms/CustomerForm';
import CustomInfoAdd from '../../../components/Orderforms/CustomInfoAdd';
import AddInfoModal from '../../../components/OrderModals/AddInfoModal';
import ProductSearch from '../../../components/ProductsSearch/ProductSearch';
import ProductAddTable from '../../../components/ProductAddTable/ProductsAddTable';
import empty from '../../../images/favicon.ico';
import OrderInvoic from '../../../components/OrderInvoice/OrderInvoic';
import PickupModal from '../../../components/OrderModals/PickupModal';
import moment from 'moment';
import CustomSpinner from '../../../components/CustomSpinner/CustomSpinner';
import "./EditOrder.css"
import ProductShortageModal from '../../../components/OrderModals/ProductShortageModal';
import ReturnModal from '../../../components/OrderModals/ReturnModal';
import RightSideBar from '../../../components/RightSideBar/RightSideBar';
import BundleAddTable from '../../../components/BundleAddTable/BundleAddTable';


const { Title } = Typography;
const { Content } = Layout;

const EditOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState({});
  const [loading, setLoading] = useState(true);
  const [pickupNReturnDate, setPickupNReturnDate] = useState([]);
  const [isRemoveCustomerLoading, setIsRemoveCustomerLoading] = useState(false);
  const [customInformation, setCustomInformation] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState({ dataType: 'singleLine', });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [bundleData, setBundleData] = useState([]);
  const [loadingProductTable, setLoadingProductTable] = useState(false);
  const [pickupLoading, setPickupLoading] = useState(false);
  const [shortageProducts, setShortageProducts] = useState([])
  const [isOpenShortageModal, seIsOpenShortageModal] = useState(false);
  const [isOpenShortageModalBundle, seIsOpenShortageModalBundle] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const orderRef = doc(db, "orders_collections", orderId);
  const orderProductRef = collection(db, "orders_collections", orderId, "products");
  const orderBundleRef = collection(db, "orders_collections", orderId, "bundles");
  const customInfoRef = collection(db, "orders_collections", orderId, 'customInformation');
const [archivedLoading, setArhivedLoading] = useState(false);

  const handleDate = async (dateString) => {
    if (dateString[0]?.length > 0) {
      const newData = { rentalPeriod: dateString }
      setPickupNReturnDate(dateString);
      await updateDoc(orderRef, newData);
    }
    else{
      const newData = { rentalPeriod: [] }
      setPickupNReturnDate([]);
      await updateDoc(orderRef, newData);
    }
  }

  const getOrderData = async () => {
    const data = await getAData(orderRef);
    setOrderData(data);
    setPickupNReturnDate(data?.rentalPeriod ? data?.rentalPeriod : []);
    const orderProducts = await getAllData(orderProductRef);
    const orderbundles = await getAllData(orderBundleRef)
    orderProducts.forEach(async (obj) => {
      const { quantity, charge, id, dayCount, imageUrl, status } = obj;
      const varaition = doc(db, "product_collections", obj.productId, "variations", obj.variationId);
      const varaitionData = await getAData(varaition);
      setProductsData((curr) => ([...curr, { ...varaitionData, imageUrl, quantity, charge, variationId: obj.variationId, productId: obj.productId, orderProductsId: id, dayCount, status }]));
    });
    orderbundles.forEach( async (bundles) => {
      const bundleDoc = doc(db, "bundles_collections", bundles.bundleId);
      const bundleData = await getAData(bundleDoc);
      setBundleData((curr) => ([...curr, {...bundles, orderBundleId: bundles.id, ...bundleData }]))
    })
    setLoading(false);
  }

  const getCustomInfo = async () => {
    const customInfoData = await getAllData(customInfoRef);
    setCustomInformation(customInfoData);
  }

  useEffect(() => {
    getOrderData();
    getCustomInfo();
  }, []);
  const handleorderStatus = async (status) => {
    const isShortage = productsData.filter((data) => data.stock - data.quantity < 0 && status !== 'Concept');
    const isShortageBundle = bundleData.filter((data) => data.stock - data.quantity < 0 && status !== 'Concept');
    if (isShortage.length > 0) {
      setShortageProducts(isShortage);
      return seIsOpenShortageModal(true);
    }
    else if (isShortageBundle.length > 0) {
      setShortageProducts(isShortageBundle);
      return seIsOpenShortageModalBundle(true);
    }
    else {
      await setOrderData((curr) => ({ ...curr, status }));
      await updateDoc(orderRef, { status });
      setLoadingProductTable(true);
      let statusChangedProducts = [];
      for (let i = 0; i < productsData.length; i++) {
        const { orderProductsId } = productsData[i];
        const productDocRef = doc(db, "orders_collections", orderId, "products", orderProductsId);
        await updateDoc(productDocRef, { status })
        statusChangedProducts.push({ ...productsData[i], status })
      }
      setProductsData(statusChangedProducts);
      let statusChangedBundles = [];
      for (let i = 0; i < bundleData.length; i++) {
        const { orderBundleId } = bundleData[i];
        const bundleDocRef = doc(db, "orders_collections", orderId, "bundles", orderBundleId);
        await updateDoc(bundleDocRef, { status })
        statusChangedBundles.push({ ...bundleData[i], status })
      }
      setBundleData(statusChangedBundles);
      setLoadingProductTable(false);
    }
  }
  const handleArchivedOrder = async () => {
    setArhivedLoading(true);
      await updateDoc(orderRef, { status: "archived" });
      setArhivedLoading(false)
      navigate('/orders');
  }
  const handleAddCustomer = async (customerData) => {
    await setOrderData((curr) => ({ ...curr, ...customerData })); 
    await Object.keys(customerData).forEach(key => customerData[key] === undefined ? delete customerData[key] : {});   
     await updateDoc(orderRef, customerData);
  }
  const handleRemoveCustomer = async () => {
    setIsRemoveCustomerLoading(true);
    const { customerId, email, name, firstName, lastName, id, ...restData } = orderData;
    await setDoc(orderRef, restData);
    setOrderData(restData);
    setIsRemoveCustomerLoading(false);
  }

  const customInfoDoc = doc(db, "orders_collections", orderId, 'customInformation', selectedInfo?.id ? selectedInfo?.id : 'abcx');
  const hanldeDeleteCustomInfo = async () => {
    await deleteDocument(customInfoDoc);
    getCustomInfo();
    setShowInfoModal(false);
  }

  const handleAddCustomInfo = async (values) => {
    await addDocumentData(customInfoRef, values);
    getCustomInfo();
    setShowInfoModal(false);
  }

  const handleEditInfo = async (values) => {
    await updateDoc(customInfoDoc, values);
    setShowInfoModal(false);
  }
  const handleAddProductData = async (products) => {
    setLoadingProductTable(true);
    setShowProducts(false)
    const { productId, id, price, product_name, imageUrl, ...rest } = products;
    const diff = moment(pickupNReturnDate[1]).diff(moment(pickupNReturnDate[0]), 'days');
    const productInfo = { product_name, productId, imageUrl, variationId: id, quantity: 1, dayCount: diff > 0 ? diff : 1, charge: diff > 0 ? (diff * price) : price, status: orderData?.status === 'Concept' ? 'Concept' : "Reserved" }
    const res = await addDocumentData(orderProductRef, productInfo);
    setProductsData((curr) => ([...curr, { ...productInfo, orderProductsId: res.id, ...rest }]));   
    setLoadingProductTable(false);
  }
  const handleAddBundleData = async (bundleData) => {
    setLoadingProductTable(true);
    setShowProducts(false)
    const { id, bundleName, imageUrl, ...rest } = bundleData;
    const diff = moment(pickupNReturnDate[1]).diff(moment(pickupNReturnDate[0]), 'days');
    const bundleInfo = { bundleId: id, quantity: 1, dayCount: diff > 0 ? diff : 1, charge: diff > 0 ? (diff * 50) : 60, status: orderData?.status === 'Concept' ? 'Concept' : "Reserved" }
    const res = await addDocumentData(orderBundleRef, bundleInfo);
    setBundleData((curr) => ([...curr, { ...bundleInfo, bundleName, imageUrl, orderBundleId: res.id, ...rest }]));   
    setLoadingProductTable(false);
  }
  const handleDeleteProduct = async (record) => {
    setLoadingProductTable(true);
    const productDocRef = doc(db, "orders_collections", orderId, "products", record.orderProductsId);
    await deleteDocument(productDocRef);
    const newData = productsData.filter((item, index) => item.orderProductsId !== record.orderProductsId);
    setProductsData(newData);
    setLoadingProductTable(false);
  };
  const handleDeleteBundle = async (record) => {
    setLoadingProductTable(true);
    const orderBundleDocRef = doc(db, "orders_collections", orderId, "bundles", record.orderBundleId);
    await deleteDocument(orderBundleDocRef);
    const newData = bundleData.filter((item, index) => item.orderBundleId !== record.orderBundleId);
    setBundleData(newData);
    setLoadingProductTable(false);
  };

  const handlepickUp = async (selectedItems, stat) => {
    const isShortage = productsData.filter((data) => data.stock - data.quantity < 0);
    if (isShortage.length > 0) {
      setShortageProducts(isShortage);
      return seIsOpenShortageModal(true);
    }
    else {
      setPickupLoading(true);
      setLoadingProductTable(true);
      for (let i = 0; i < productsData.length; i++) {
        const { orderProductsId, variationId, productId, quantity } = productsData[i];
        const productDocRef = doc(db, "orders_collections", orderId, "products", orderProductsId);       
       
        if (selectedItems.includes(orderProductsId)) {
          await updateDoc(productDocRef, { status: stat })
          if (stat === "Picked up") {
            const variationDoc = doc(db, "product_collections", productId, 'variations', variationId);
            const data = await getAData(variationDoc);    
            await updateDoc(variationDoc, {pickedUp: parseFloat(data?.pickedUp) + parseFloat(quantity)});
           }
           if (stat === "returned") {
            const variationDoc = doc(db, "product_collections", productId, 'variations', variationId);
           const data = await getAData(variationDoc);
           await updateDoc(variationDoc, { pickedUp: parseFloat(data?.pickedUp) - parseFloat(quantity) });
          }                  
        }        
      }
      setProductsData([]);
      getOrderData()
      setLoadingProductTable(false);
      setPickupLoading(false);
      setShowPickupModal(false);
      setShowReturnModal(false);
    }
  }
  const [items, setItems] = useState(0);

  const calculateItems = (data, bundleData) => {
    const quantity = data.map(data => parseFloat(data.quantity));
    let total = quantity.reduce((a, b) => a + b, 0);    
    const bundleQuantity = bundleData.map(data => parseFloat(data.quantity));
    let bundletotal = bundleQuantity.reduce((a, b) => a + b, 0);
    setItems(total+ bundletotal);
  }
  const setStatus = async () => {
    const pickedUp = productsData.filter(({ status }) => status === "Picked up");
    const reserved = productsData.filter(({ status }) => status === "Reserved");
    const concept = productsData.filter(({ status }) => status === "Concept");
    const returned = productsData.filter(({ status }) => status === "returned");
    const bundlepickedUp = bundleData.filter(({ status }) => status === "Picked up");
    const bundlereserved = bundleData.filter(({ status }) => status === "Reserved");
    const bundleconcept = bundleData.filter(({ status }) => status === "Concept");
    const bundlereturned = bundleData.filter(({ status }) => status === "returned");
    if (pickedUp.length === productsData.length && bundlepickedUp.length === bundleData.length) {
      setOrderData((curr) => ({ ...curr, status: 'Picked up' }));
      await updateDoc(orderRef, { status: 'Picked up' });
      return;
    }
    if (reserved.length === productsData.length && bundlereserved.length === bundleData.length) {
      setOrderData((curr) => ({ ...curr, status: 'Reserved' }));
      await updateDoc(orderRef, { status: 'Reserved' });
      return;
    }
    if (concept.length === productsData.length && bundleconcept.length === bundleData.length) {
      setOrderData((curr) => ({ ...curr, status: 'Concept' }));
      await updateDoc(orderRef, { status: 'concept' });
      return;
    }
    if (returned.length === productsData.length && bundlereturned.length === bundleData.length) {
      setOrderData((curr) => ({ ...curr, status: 'returned' }));
      await updateDoc(orderRef, { status: 'returned' });
      return;
    }
    else {
      setOrderData((curr) => ({ ...curr, status: 'Mixed' }));
      await updateDoc(orderRef, { status: 'Mixed' });
      return;
    }
  }
  useEffect(() => {
    calculateItems(productsData, bundleData);
    setStatus();
  }, [productsData, bundleData]);

  return (
    <>
      {
        loading ?
          <div className="order-edit-loading">
            <CustomSpinner />
          </div>
          :
          <>
            <Header>
              <div className='order-header order-header-edit'>
                <div>
                  <Title>Order &nbsp; <b>{`#${orderData?.orderNumber}`}</b> </Title>
                  <button className={orderData?.status.toLowerCase().split(" ")[0]} > {orderData?.status === "Mixed" ? null : items > 0 && items} {orderData?.status}</button>
                </div>
                <div className='order-btn'>


                  {
                    pickupNReturnDate?.length > 0 &&
                    <>
                      {
                        orderData?.status === 'Concept' &&
                        <Button icon={<LockOutlined />} loading={loading} type='primary' size='large' onClick={() => handleorderStatus('Reserved')}>Reserve</Button>
                      }
                      {
                        productsData.length > 0 && productsData.filter(({ status }) => status !== "Picked up" && status !== "returned").length > 0 ?
                          <Button icon={<FaLevelUpAlt />} type='primary' danger size='large' onClick={() => setShowPickupModal(true)}> Pick up items</Button>
                          :
                          null
                      }
                      {
                        productsData.length > 0 && productsData.filter(({ status }) => status === "Picked up").length > 0 ?
                          <Button icon={<FaLevelUpAlt />} type='primary' size='large' style={{ background: 'rgb(116, 204, 32)' }} onClick={() => setShowReturnModal(true)}>Return items</Button>
                          :
                          null
                      }
                       {
                        orderData?.status === 'returned' &&
                        <Button icon={<DeleteOutlined />} loading={archivedLoading} size='large' onClick={handleArchivedOrder}>Archive order</Button>
                      }
                    </>
                  }                  
                  <div className='order-btn-options'>
                    <Dropdown overlayClassName='order-btn-options-dropdown' 
                    menu={{items: [
                      {
                        label: 'Revert to concept',
                        key: '1',
                        disabled: orderData?.status === 'Concept' || orderData?.status === 'picked up' 
                      },
                      {
                        label: 'Revert to reserved',
                        key: '2',
                        disabled: !(orderData?.status === 'Reserve')
                      },
                      {
                        label: 'Revert to reserved',
                        key: '3',
                        disabled: !(orderData?.status === 'Concept')
                      },
                      {
                        label: 'Revert to reserved',
                        key: '4',
                        disabled: !(orderData?.status === 'Concept')
                      },
                      {
                        label: 'Cancel order',
                        key: '5',
                      }
                    ]}} trigger={['click']} arrow>
                      <Button icon={<DashOutlined />} size='large' />
                    </Dropdown>
                  </div>

                </div>
              </div>
            </Header>
            <Content className='main_content'>
              <Row gutter={[24, 8]} className="edit_content">
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
                        productsData.length > 0 || bundleData.length > 0 ?
                          <div className="product-details">
                            <ProductAddTable
                              orderId={orderId}
                              loadingProductTable={loadingProductTable}
                              productsData={productsData}
                              handleDeleteProduct={handleDeleteProduct}
                              setProductsData={setProductsData}
                              pickupNReturnDate={pickupNReturnDate}
                            />
                             {
                              bundleData.length > 0 &&
                              <BundleAddTable
                              orderId={orderId}
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
                      <OrderInvoic productsData={productsData} bundleData={bundleData} orderId={orderId} />
                    </div>
                  </div>
                </Col>
              </Row>
            </Content>
            <RightSideBar orderId={orderId} />
            <AddInfoModal
              info={selectedInfo}
              showInfoModal={showInfoModal}
              setShowInfoModal={setShowInfoModal}
              hanldeDelete={hanldeDeleteCustomInfo}
              handleSaveInfo={handleAddCustomInfo}
              handleEditInfo={handleEditInfo}
            />
            <ProductShortageModal
              isOpenShortageModalBundle={isOpenShortageModalBundle}
              isShowModal={isOpenShortageModal}
              setIsShowModal={seIsOpenShortageModal}
              dataSource={shortageProducts}
            />
            <PickupModal
              showPickupModal={showPickupModal}
              setShowPickupModal={setShowPickupModal}
              productsData={productsData.filter(({ status }) => status !== "Picked up" && status !== "returned")}
              handlepickUp={handlepickUp}
              pickupLoading={pickupLoading}
            />
            <ReturnModal
              showReturnModal={showReturnModal}
              setShowReturnModal={setShowReturnModal}
              productsData={productsData.filter(({ status }) => status === "Picked up")}
              handleReturn={handlepickUp}
            // returnLoading={returnLoading}
            />
          </>
      }
    </>
  );
};

export default EditOrder;