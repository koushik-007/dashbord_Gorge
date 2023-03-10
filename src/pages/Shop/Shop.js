import React, { useEffect, useState, useContext } from 'react';
import "./Shop.css";
import { Col, DatePicker, Row, Input, Select, Button, } from 'antd';
import { collection } from 'firebase/firestore';
import { db, getAllData } from '../../Firebasefunctions/db';
import moment from 'moment/moment';
import { RentalPeriodProvider } from '../../context/RentalPeriodContext';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import Products from './Products';
import Bundles from './Bundles';
import { useMemo } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useDebounce } from '../../customhook/debounce';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Shop = () => {
    const [rentalPeriod, setRentalPeriod] = useContext(RentalPeriodProvider);
    const [data, setData] = useState([]);
    const [bundleData, setBundleData] = useState([])
    const [loading, setLoading] = useState(false);
    const [selectedSorting, setSelectedSorting] = useState('standard')

    const handlePeriod = (date, dateString) => {
        const diff = moment(dateString[1]).diff(moment(dateString[0]), 'days')
        setRentalPeriod({ rentalPeriod: dateString, dayCount: diff > 0 ? diff : 1 });
    }
    const [searchData, setSearchData] = useState([]);
    const [searchBundleData, setSearchBundleData] = useState([]);
    const [searchValue, setSearchValue] = useState('')
    
    const debouncedValue = useDebounce(searchValue, 300);
    useEffect(()=> {
        setLoading(true);
        const filteredProduct = data.filter((item) => item.product_name.toLowerCase().match(debouncedValue))        
        if (!Array.isArray(filteredProduct)) {
            setSearchData([])
        } if (Array.isArray(filteredProduct)) {
            setSearchData(filteredProduct)
        }        
        setLoading(false);
    }, [debouncedValue, data]);
    
    useEffect(()=> {
        setLoading(true);
        const filteredBundle = bundleData.filter((item) => item?.bundleName.toLowerCase().match(debouncedValue))        
        if (!Array.isArray(filteredBundle)) {
            setSearchBundleData([])
        } if (Array.isArray(filteredBundle)) {
            setSearchBundleData(filteredBundle)
        }
        setLoading(false);
    }, [debouncedValue, bundleData]);
    const filterData = useMemo(() => {
        const alldata = [...searchData];
        if (selectedSorting === 'asc') {
            return alldata.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        }
        else if (selectedSorting === 'dsc') {
            return alldata.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        }
        return searchData
    }, [selectedSorting, searchData]);
    const filterBundleData = useMemo(() => {
        const alldata = [...searchBundleData];
        if (selectedSorting === 'asc') {
            return alldata.sort((a, b) => parseInt(a.price) - parseInt(b.price));
        }
        else if (selectedSorting === 'dsc') {
            return alldata.sort((a, b) => parseInt(b.price) - parseInt(a.price));
        }
        return searchBundleData
    }, [selectedSorting, searchBundleData]);
    const productCollectionsRef = collection(db, "product_collections");
    const bundlesCollectionsRef = collection(db, "bundles_collections");
    useEffect(() => {
        const getData = async () => {
            setLoading(true)
            const data = await getAllData(productCollectionsRef);
            setData(data);
            setSearchData(data)
            const bundleData = await getAllData(bundlesCollectionsRef);
            setBundleData(bundleData);
            setSearchBundleData(bundleData)
            setLoading(false)
        }
        if (data.length === 0) {
            getData();
        }
    }, []);
    return (
        <Row gutter={16} justify="space-between">
            <Col className="gutter-row" lg={6} span={24}>
                <div className="date-time-box">
                    <div className="date-time-sub">
                        <RangePicker
                            suffixIcon={<span>Return</span>}
                            clearIcon={null}
                            separator={<span>PickUp</span>}
                            popupClassName="cart_custom_range"
                            bordered={false}
                            showTime={{ format: 'hh:mm A', use12Hours: true }}
                            format={['YYYY-MM-DD hh:mm A']}
                            value={rentalPeriod.rentalPeriod.length > 0 ? [moment(rentalPeriod.rentalPeriod[0]), moment(rentalPeriod.rentalPeriod[1])] : []}
                            onChange={handlePeriod}
                            disabledDate={(current) => current && current < moment().startOf('day')}
                        />
                    </div>
                </div>
            </Col>
            <Col className="gutter-row" lg={18} span={24}>
                <div className="products_bundles">
                    <div className='searching_sorting_wrapper'>
                        <div className="searching_sorting">
                            <div className="searching_box">
                                <Input.Group compact>
                                    <Input
                                        style={{
                                            width: 'calc(100% - 40px)',
                                        }}
                                         size="large" 
                                         placeholder="Search products" 
                                         className='inputSearch'
                                          onChange={(e)=> setSearchValue(e.target.value)}
                                    />
                                    <Button type='primary' size='large' icon={<BsSearch />} />
                                </Input.Group>
                                
                            </div>
                            <div className="filter_box">
                                <Select
                                    defaultValue="standard"
                                    size='large'
                                    onChange={(value) => setSelectedSorting(value)}
                                >
                                    <Option value="standard">Standard sorting</Option>
                                    <Option value="asc">Price (asc)</Option>
                                    <Option value="dsc">Price (dsc)</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                    {
                        rentalPeriod?.rentalPeriod.length === 0 ?
                            <div className='rental_period_select'>
                                <Button size='large' type='text'>Select your rental period for prices and availability</Button>
                            </div>
                            : null
                    }
                    <Row>
                        {
                            loading ?
                                <CustomSpinner />
                                :
                                filterData.map((data, index) => <Products
                                    key={index}
                                    dayCount={rentalPeriod?.dayCount}
                                    data={data}
                                    rentalPeriod={rentalPeriod?.rentalPeriod}
                                />)
                        }

                        {
                            filterBundleData.map((data, index) => <Bundles
                                key={index}
                                dayCount={rentalPeriod?.dayCount}
                                data={data}
                                rentalPeriod={rentalPeriod?.rentalPeriod}
                            />)
                        }
                    </Row>
                </div>
            </Col>
        </Row>
    );
};

export default Shop;