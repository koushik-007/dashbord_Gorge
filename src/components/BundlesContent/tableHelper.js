import { Skeleton, InputNumber, Select } from 'antd';
import { MenuOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { db, getAllData } from '../../Firebasefunctions/db';
import { useEffect, useState } from 'react';
import Variants from '../Variants/Variants';
import { useDebounce } from '../../customhook/debounce';
const { Option } = Select;

export const columns = [
  {
    key: '1',
    title: '',
    dataIndex: 'menubar',
    width: 60,
    render: () => (
      <MenuOutlined
        style={{
          color: '#000',
        }}
      />
    )
  },
  {
    key: '2',
    title: 'Product',
    dataIndex: 'imageUrl',
    width: 200,
    render: (imageUrl, record) => {
      return <div className="addTobundleTr">
        {imageUrl ? <img src={imageUrl} alt="product" /> : <Skeleton.Image active={false} />}
        <span>{record.product_name}</span>
      </div>
    }
  },
  {
    key: '3',
    title: 'Variation',
    dataIndex: 'variation',
    width: 300
  },
  {
    key: '4',
    title: 'Quantity',
    dataIndex: 'quantity',
    width: 200,
  },
  {
    key: '5',
    title: 'Discount',
    dataIndex: 'product_details',
    width: 100
  },
]

export const CustomCell = ({ record, handleQuantity, dataIndex, BundlesId, children, addproductToBundle,setAddproductToBundle, ...restProps }) => {

  const [variationData, setVariationData] = useState([])
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    const variationColl = collection(db, "product_collections", record?.productId ? record?.productId : "", "variations");
    try {
      const data = await getAllData(variationColl);
      setVariationData(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (record?.productId) {
      getData();
    }
  }, []);
  const variantsDestruct = (obj) => {
    const { id, key, price, stock, pickedUp, productId, product_name, ...rest } = obj;
    const variants = Object.keys(rest);
    return variants.map((item) => rest[item])
  }
  const handleSelectVariation = async (value, id) => {
    setLoading(true);
    const newData = [...addproductToBundle];
    const index = newData.findIndex((item) => id === item.id);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, variation: value });
      const bundlesProDocRef = doc(db, "bundles_collections", BundlesId, "product_collections", id);
      await updateDoc(bundlesProDocRef, { variation: value });
      setAddproductToBundle(newData);
    }    
    setLoading(false)
  }
  const [changesQuantity, setChangeQuantity] = useState(0);
  const debounceValue = useDebounce(changesQuantity, 300);
  useEffect(() => {
    if (debounceValue) {
      handleQuantity(debounceValue, record.id)
    }
  }, [debounceValue])
  if (dataIndex === "quantity") {
    return <td {...restProps}>
      <span className='bundleQuantity'>
        <InputNumber
          min={0}
          size='large'
          defaultValue={record.quantity}
          onChange={(value) => setChangeQuantity(value)}
          controls={{ upIcon: <PlusOutlined />, downIcon: <MinusOutlined /> }}
        />
      </span>
    </td>
  }
  if (dataIndex === "variation") {
    return (
      <td {...restProps}>
        <Select size="large"
          defaultValue={record?.variation}
          style={{ width: '100%' }}
          onChange={(value) => handleSelectVariation(value, record.id)}
          loading={loading}
          disabled={loading}
        >
          <Option value="any">any variation</Option>
          {
            variationData.map((obj) => {
              const { id, key, stock } = obj;
              const values = variantsDestruct(obj);
              return (
                <Option key={key} value={id}>
                  <Variants data={values} />
                  {`(${stock} available)`}
                </Option>
              )
            })
          }
        </Select>
      </td>
    )
  }
  return <td {...restProps}>
    {children}
  </td>
};