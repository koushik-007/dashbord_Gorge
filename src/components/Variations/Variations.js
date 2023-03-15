import { useEffect, useState } from 'react';
import { Button, Form, message, Popover, Table, Tooltip } from 'antd';
import "./Variations.css"
import img from "../../images/large_photo.jpg";
import { PlusOutlined, EditOutlined, DeleteOutlined, BarcodeOutlined } from '@ant-design/icons';
import { FaBars } from "react-icons/fa"
import PropertyModal from '../PropertyModal/PropertyModal';
import { columns, EditableCell } from './TableHelper';
import { db, getAllData, deleteDocument, editData, addDocumentData } from '../../Firebasefunctions/db';
import { addDoc, collection, doc, query, setDoc, where } from 'firebase/firestore';

const { Column } = Table;

const Variations = ({ productId, imageUrl, price, data, setData, tracking_method, product_name }) => {
  const [loading, setLoading] = useState(false);
  const [addProperty, setAddProperty] = useState('');
  const [addPropertyId, setAddPropertyId] = useState('');
  const [newColumn, setNewColumn] = useState([]);
  const [variationData, setVariationData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleTwo, setIsModalVisibleTwo] = useState(false);
  const [isModalVisibleThree, setIsModalVisibleThree] = useState(false);
  const [isModalVisibleFour, setIsModalVisibleFour] = useState(false);
  const [isModalVisibleFive, setIsModalVisibleFive] = useState(false);
  const [deletedVariationKey, setDeletedVariationKey] = useState('')
  const [isDisabled, setIsDisabled] = useState(true);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const [isAddPropertyLoading, setISAddPropertyLoading] = useState(false);
  const [isEditingPropertyLoading, setIsEditingPropertyLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isAddVariationLoading, setIsAddVariationLoading] = useState(false);


  const subProductCollectionsRef = collection(db, "product_collections", productId, 'columns');
  const variationCollection = collection(db, "product_collections", productId, 'variations');

  useEffect(() => {
    const variations = data.map((doc) => ({ ...doc, image: imageUrl }));
    setVariationData(variations);
  }, [data, imageUrl]);
  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      const columns = await getAllData(subProductCollectionsRef);
      const columnsData = columns.map((doc) => {
        return {
          ...doc,
          key: doc.id,
          image: <span> <FaBars /> &nbsp; <img src={img} width="30px" alt='' /> </span>,
        }
      });
      setNewColumn(columnsData)
      setLoading(false)
    }
    getData();
  }, [isEditingPropertyLoading])


  const handleOk = async () => {
    setISAddPropertyLoading(true);
    const res = await addDoc(subProductCollectionsRef, {
      title: addProperty,
      dataIndex: addProperty.toLowerCase(),
    })
    setNewColumn((curr) => [...curr, {
      title: addProperty,
      dataIndex: addProperty.toLowerCase(),
      editable: true,
      id: res.id
    }])

    setAddProperty('')
    setISAddPropertyLoading(false);
    setIsModalVisible(false);
  };

  const handleEditColumn = async () => {
    setIsEditingPropertyLoading(true)
    const newData = {
      title: addProperty,
      dataIndex: addProperty.toLowerCase(),
    }
    const userDoc = doc(db, "product_collections", productId, 'columns', addPropertyId);
    await editData(userDoc, newData);
    const findColumn = newColumn.find(({ id }) => id === addPropertyId);
    const { dataIndex } = findColumn;
    const newd = [...data];
    newd.forEach(async (object) => {
      object[addProperty] = object[dataIndex];
      delete object[dataIndex];
      const { id, key, ...rest } = object;
      const variationDocRef = doc(db, "product_collections", productId, 'variations', id);
      await setDoc(variationDocRef, rest);
    });
    setData(newd);
    setAddProperty('');
    setIsEditingPropertyLoading(false);
    setIsModalVisibleTwo(false);
  }

  const handleDeleteProperty = async () => {
    setIsDeleteLoading(true);
    // if (newColumn.length === 1) {
    //   setAddProperty('')
    //   setIsDeleteLoading(false);
    //   setIsModalVisibleTwo(false);
    //   return;
    // }
    const userDoc = doc(db, "product_collections", productId, 'columns', addPropertyId);
    await deleteDocument(userDoc);
    const newData = newColumn.filter(({ id }) => id !== addPropertyId);
    setNewColumn(newData);
    const findColumn = newColumn.find(({ id }) => id === addPropertyId);
    const { dataIndex } = findColumn;
    const newd = [...data];
    newd.forEach(async (object) => {
      delete object[dataIndex];
      const { id, key, ...rest } = object;
      const variationDocRef = doc(db, "product_collections", productId, 'variations', id);
      await setDoc(variationDocRef, rest);
    });
    setData(newd);
    setAddProperty('')
    setIsDeleteLoading(false);
    setIsModalVisibleTwo(false);
  }

  const handleDeleteVariation = async () => {
    setIsDeleteLoading(true);
    const ordersCollectionRef = collection(db, "orders_collections");
    const orderData = await getAllData(ordersCollectionRef);
    for (let i = 0; i < orderData.length; i++) {
      const { id } = orderData[i];
      const orderProducts = collection(db, "orders_collections", id, "products");
      const q = query(orderProducts, where("variationId", "==", deletedVariationKey), where("productId", "==", productId), where("status", 'array-contains-any', ['"Reserved"', 'Picked up']))
      const querySnapshot = await getAllData(q);
      if (querySnapshot.length > 0) {
        setIsModalVisibleThree(false);
        setIsDeleteLoading(false);
        return message.error("this prduct has been reserved/picked up so it can't delete now");
     }
    }
    const variationDoc = doc(db, "product_collections", productId, 'variations', deletedVariationKey);
    await deleteDocument(variationDoc);
    const newData = data.filter(({ key }) => key !== deletedVariationKey);
    setData(newData);
    setIsDeleteLoading(false);
    setIsModalVisibleThree(false);
  }



  const isEditing = ((record) => record.key === editingKey);

  const edit = async (record) => {
    form.resetFields();
    form.setFieldsValue(record);
    setEditingKey(record.key);
    setIsDisabled(true);
  };

  const cancel = (itemKey) => {
    if (itemKey.length < 5) {
      const newData = data.filter(({ key }) => key !== itemKey);
      setData(newData);
    }
    form.setFieldsValue({});
    setEditingKey('');
  };
  const save = async (key, index) => {
    setIsAddVariationLoading(true);
    try {
      const row = await form.validateFields();
      let count = 0;
      const keys = Object.keys(row);
      const checkData = [...data];
      checkData.splice(index, 1);
      keys.forEach((key) => {
        for (const object of checkData) {
          if (object[key] === row[key]) {
            count++;
          }
        }
      })
      if (count < keys.length) {
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key && key.length > 5);

        if (index > -1) {
          const variationDoc = doc(db, "product_collections", productId, 'variations', key);
          await editData(variationDoc, row);
          const item = newData[index];
          newData.splice(index, 1, { ...item, ...row });
          setData(newData);
          setIsAddVariationLoading(false);
          setEditingKey('');
        }
        else {
          const pickedUp = tracking_method === "Rental product" ? 0 : null
          const res = await addDocumentData(variationCollection, {...row, stock: 0, pickedUp, product_name });
          const item = newData[newData.length];
          row.key = res.id;
          newData.splice(newData.length, 1, { ...item, ...row, id: res.id, stock: 0, pickedUp });
          setData(newData);
          setIsAddVariationLoading(false);
          setEditingKey('');
        }
      }
      else {
        setIsModalVisibleFive(true);
        setIsAddVariationLoading(false);
      }
    } catch (errInfo) {
      setIsAddVariationLoading(false);
      console.log('Validate Failed:', errInfo);
    }
  };
  const handleAdd = () => {
    const newData = {
      key: String(Math.random()),
      price: price,
    };
    setVariationData([...variationData, newData])
    edit(newData)
  };
  const [barcodeNumber, setBarcodeNumber] = useState(null);

  const handleBarCode = () => {
    let ean13 = Math.floor(1000000000000 + Math.random() * 9000000000000);
    setBarcodeNumber(ean13)
  }
  return (
    <div style={data.length < 8 ? { height: '100vh' } : {}}>
      <Form form={form} component={false}
        onFieldsChange={(changedFields, allFields) => {
          const record = variationData.find(({ key }) => key === editingKey);
          if (record[changedFields[0].name[0]] !== changedFields[0].value) {
            setIsDisabled(false);
          } else {
            setIsDisabled(true);
          }
        }}>
        <Table
          loading={loading}
          rowClassName="editable-row"
          components={{ body: { cell: EditableCell } }}
          dataSource={variationData}
          className="variationTable"
        >
          {
            columns.map(({ title, dataIndex, render }) => <Column
              title={title}
              dataIndex={dataIndex}
              key={dataIndex}
              render={render}
              onCell={
                (record) => ({
                  record,
                  inputType: dataIndex === 'price' ? 'number' : 'text',
                  dataIndex: dataIndex,
                  title: title,
                  editing: dataIndex === "image" ? false : isEditing(record),
                })
              }
            />)
          }

          {
            newColumn.map(({ title, dataIndex, id }) => <Column
              title={
                <span
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={() => { setIsModalVisibleTwo(true); setAddProperty(title); setAddPropertyId(id) }}
                >{title}
                </span>
              }
              dataIndex={dataIndex}
              key={dataIndex}
              onCell={
                (record) => ({
                  record,
                  inputType: 'text',
                  dataIndex,
                  title,
                  editing: isEditing(record),
                })
              }
            />)
          }
          <Column
            title={<span onClick={() => setIsModalVisible(true)}> <PlusOutlined /> &nbsp; Add property</span>}
            key="addProperty"
            dataIndex="addProperty"
            render={(_, record, index) => {
              const editable = isEditing(record);
              return editable ? (<>
                <Button size='large' className='cancelBtn' onClick={() => cancel(record.key)}> Cancel</Button>
                <Button size='large' disabled={isDisabled} type='primary' loading={isAddVariationLoading} onClick={() => save(record.key, index)}>Save</Button>
              </>

              ) : (
                <>
                  <Button className='editAndDel' size='large' onClick={() => edit(record)} icon={<EditOutlined />} />
                  <Button className='editAndDel' size='large' onClick={() => setIsModalVisibleFour(true)} icon={<BarcodeOutlined />} />
                  {
                    variationData.length > 1 ?
                     <Button className='editAndDel' size='large' onClick={() => { setIsModalVisibleThree(true); setDeletedVariationKey(record.key) }} icon={<DeleteOutlined />} />
                    :                    
                    <Tooltip placement="bottomRight" overlayInnerStyle={{color: 'black', background: 'white'}} destroyTooltipOnHide={{ keepParent: false }} title={"Product needs at least one variation"}>
                    <Button disabled className='editAndDel oneVariationDel' size='large' icon={<DeleteOutlined />} />
                  </Tooltip>
                  }
                </>
              );
            }}
          />
        </Table>
        {
          newColumn.length > 0 ?
            <Button onClick={handleAdd} size="large">Add variation</Button>
            :
            <Popover
              destroyTooltipOnHide={{ keepParent: false }}
              placement="bottom"
              content={
                <div style={{ width: '150px', textAlign: 'center' }}>
                  <p>You need to create a property before you can create a variation.</p>
                  <Button onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>Add property</Button>
                </div>
              }>
              <Button size='large'>Add variation</Button>
            </Popover>
        }
      </Form>
      <PropertyModal modalType="Add property" addProperty={addProperty} isModalVisible={isModalVisible} handleOk={handleOk} setIsModalVisible={setIsModalVisible} setAddProperty={setAddProperty} loading={isAddPropertyLoading} />

      <PropertyModal modalType="Edit property" addProperty={addProperty} isModalVisible={isModalVisibleTwo} handleOk={handleEditColumn} setIsModalVisible={setIsModalVisibleTwo} setAddProperty={setAddProperty} isDelete={true} handleDelete={handleDeleteProperty} isDeleteLoading={isDeleteLoading} loading={isEditingPropertyLoading} />

      <PropertyModal modalType="Delete variation" addProperty={addProperty} isModalVisible={isModalVisibleThree} setIsModalVisible={setIsModalVisibleThree} setAddProperty={setAddProperty} handleDeleteVariation={handleDeleteVariation} isDeleteLoading={isDeleteLoading} />

      <PropertyModal modalType="Add barcode" addProperty={addProperty} isModalVisible={isModalVisibleFour} handleOk={handleBarCode} setIsModalVisible={setIsModalVisibleFour} setAddProperty={setAddProperty} barcodeNumber={barcodeNumber} />

      <PropertyModal modalType="Edit Variation" isModalVisible={isModalVisibleFive} setIsModalVisible={setIsModalVisibleFive} />
    </div>
  );
};

export default Variations;