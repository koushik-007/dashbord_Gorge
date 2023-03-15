import { Button, Collapse, Input, Skeleton, Spin } from 'antd';
import { collection } from 'firebase/firestore';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db, getAllData } from '../../Firebasefunctions/db';
import { PlusOutlined, SearchOutlined, LoadingOutlined, FileSearchOutlined } from '@ant-design/icons';
import Variants from '../Variants/Variants';

const { Panel } = Collapse;

const ProductSearch = ({ handleAddProductData, handleAddBundleData ,showProducts, setShowProducts }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [bundleData, setBundleData] = useState([])
    const getData = useCallback(async () => {
        if (data.length === 0) {
            setLoading(true);
            const productCollectionsRef = collection(db, "product_collections");
            const bundlesCollectionRef = collection(db, "bundles_collections");
            //const bundlesProDocRef = doc(db, "bundles_collections", BundlesId, "product_collections", id); 
            const data = await getAllData(productCollectionsRef);
            const bundleData = await getAllData(bundlesCollectionRef);
            for (let i = 0; i < data.length; i++) {
                const product = data[i];
                const { id } = product;
                const variationCollection = collection(db, "product_collections", id, 'variations');
                const x = await getAllData(variationCollection);
                product['variations'] = [...x]
            }
            setLoading(false);
            setData(data);
            setBundleData(bundleData)
        }

    }, [data])
 

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
                        getData()
                    }}
                    size="large" placeholder="Search" className='inputSearch'
                    prefix={loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : <SearchOutlined className='searchIcon' />}
                />
                <Button size='large' icon={<FileSearchOutlined />} />
            </Input.Group>
            <div className={`dropdownOption productDropdown ${showProducts ? 'activated' : ''}`} >
                {
                    loading ? <p>Loading...</p>
                        :
                        <>
                            <div className='showingOptions'>
                                <p>Showing 1-{data.length} of {data.length}</p>

                            </div>
                            <Collapse accordion >
                                {
                                    data.length > 0 && data.map((products, index) => {
                                        const { product_name, variations, imageUrl, id } = products;
                                        return (
                                            <Panel key={index} header={product_name}>
                                                {
                                                    variations && variations.map((data, index) => {
                                                        const { product_name, key, price, stock, pickedUp, id: na, ...rest } = data;
                                                        return (
                                                            <div key={index} className='options' onClick={() => handleAddProductData({ ...data, productId: id, imageUrl })}>
                                                                <div className='productAvatar'>
                                                                    {
                                                                        imageUrl ?
                                                                            <img src={imageUrl} alt="product" />
                                                                            :
                                                                            <Skeleton.Image active={false} />
                                                                    }
                                                                    <b>{product_name} {Object.keys(rest).length > 0 && '-'} <Variants data={rest} />
                                                                    </b>
                                                                </div>
                                                                <div className="addOptionBtn">
                                                                    <button><PlusOutlined color='white' /> &nbsp;Add product</button>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Panel>
                                        )
                                    })}
                                <Panel key={Math.random()} header="Bundles">
                                    {
                                        bundleData.length > 0 && bundleData.map((data) => {
                                            const { bundleName, imageUrl, id } = data;
                                            return (
                                                <div key={id} className='options' onClick={() => handleAddBundleData(data)}>
                                                    <div className='productAvatar'>
                                                        {
                                                            imageUrl ?
                                                                <img src={imageUrl} alt="product" />
                                                                :
                                                                <Skeleton.Image active={false} />
                                                        }
                                                        <b>{bundleName}</b>
                                                    </div>
                                                    <div className="addOptionBtn">
                                                        <button><PlusOutlined color='white' /> &nbsp;Add product</button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </Panel>
                            </Collapse>
                        </>
                }
            </div>
        </div>
    );
};

export default ProductSearch;