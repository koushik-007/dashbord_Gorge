import { Button, Input, Skeleton, Spin } from 'antd';
import { collection } from 'firebase/firestore';
import React, { useState, useEffect, useRef } from 'react';
import { db, getAllData } from '../../Firebasefunctions/db';
import { PlusOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons';
import { FiUserPlus } from 'react-icons/fi';
import Variants from '../Variants/Variants';


const ProductSearch = ({ handleAddProductData, showProducts, setShowProducts }) => {    
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([])
    const [variationData, setVariationData] = useState([]);
    const productCollectionsRef = collection(db, "product_collections");
    const getData = async () => {
        if (data.length === 0) {
            setLoading(true);
            const data = await getAllData(productCollectionsRef);
            for (let i = 0; i < data.length; i++) {
                const { id, product_name, imageUrl } = data[i];
                const variationCollection = collection(db, "product_collections", id, 'variations');
                const x = await getAllData(variationCollection);
                x.forEach(obj => {
                    obj.product_name = product_name;
                    obj.imageUrl = imageUrl;
                    obj.productId = id;
                });
                setVariationData((curr) => ([...curr, ...x]))
            }
            setData(data);
        }
        setLoading(false);
    }
    const ref = useRef(null);
    useEffect(() => {
        function close(e) {    
            if (!ref?.current?.contains(e.target)) {
                setShowProducts(false);
              }
          }
        document.body.addEventListener('click', close);
    }, []);
    return (
        <div className="product-search" ref={ref}>
            <Input.Group compact>
                <Input
                    style={{
                        width: 'calc(100% - 40px)',
                    }}
                    onClick={() => {
                        setShowProducts(true);
                        getData();
                    }}
                    size="large" placeholder="Search" className='inputSearch'
                    prefix={loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : <SearchOutlined className='searchIcon' />}
                />
                <Button size='large' icon={<FiUserPlus />} />
            </Input.Group>
                <div className={`dropdownOption ${showProducts ? 'activated' : ''}`} >
                    <div className='showingOptions'>
                        {
                            loading ? <p>Loading...</p>
                                :
                                <p>Showing 1-{data.length} of {data.length}</p>
                        }
                    </div>
                    {
                        variationData.map((products, index) => {
                            const { product_name, imageUrl, id, key, price, stock, pickedUp, productId,...rest } = products;                            
                            return (<div className='options' key={index} onClick={() =>  handleAddProductData(products)}>
                                <div className='productAvatar'>
                                    {
                                        imageUrl ?
                                            <img src={imageUrl} alt="product" />
                                            :
                                            <Skeleton.Image active={false} />
                                    }
                                    <b>{product_name} - &nbsp; <Variants data={rest} />                                    
                                    </b>
                                </div>
                                <div className="addOptionBtn">
                                    <button><PlusOutlined color='white' /> &nbsp;Add product</button>
                                </div>
                            </div>
                            )
                        })}
                </div>            
        </div>
    );
};

export default ProductSearch;