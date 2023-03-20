import React, { useContext, useState, useEffect } from 'react';
import { Button, Col, DatePicker, Row, Skeleton, Table } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { RentalPeriodProvider } from '../../context/RentalPeriodContext';
import { ShopCartProvder } from '../../context/ShopCartContext';
import "./ShopCartDetails.css";
import { columns } from './tableHelper';
import { CustomCell } from './CustomCell';
import { CartWarningContextProvider } from '../../context/CartWarningContext';
import { useMemo } from 'react';
import Variants from '../Variants/Variants';

const { RangePicker } = DatePicker;
const { Column } = Table;

const ShopCartDetails = () => {
    const [cartData, setCartData] = useContext(ShopCartProvder);
    const [rentalPeriod, setRentalPeriod] = useContext(RentalPeriodProvider);
    const [cartWarning, setCartWarning] = useContext(CartWarningContextProvider);
    const { dayCount } = rentalPeriod;
    const [subTotal, setSubTotal] = useState(0);

    const handlePeriod = (date, dateString) => {
        const diff = moment(dateString[1]).diff(moment(dateString[0]), 'days');
        setRentalPeriod({ rentalPeriod: dateString, dayCount: diff > 0 ? diff : 1 });
    } 
    const [dataSource, setDataSource] = useState([])   
     useEffect(()=> {
        const data = cartData.map((item, index) => {
            if (item?.isBundle) {
                const {bundleName, productCount, price, imageUrl, stock, id } = item;
                return {
                    key: id,
                    product: <div className="cart_table_product">
                    {imageUrl ? <img src={imageUrl} alt="product" /> : <Skeleton.Image active={false} />}
                    <div className="cart_table_product_details">
                      <span>{bundleName}</span>
                      <span>{stock} available</span>
                    </div>
                  </div>,
                    price,
                    quantity: productCount,
                }
            }
            const { product_name, imageUrl, productCount, id, key, price, dayCount, stock, quantity, pickedUp,variationId,productId, taxProfile, isBundle, ...rest } = item;      
            return {
                key: id,
                product: <div className="cart_table_product">
                      {imageUrl ? <img src={imageUrl} alt="product" /> : <Skeleton.Image active={false} />}
                      <div className="cart_table_product_details">
                        
                        <span>  
                        <span>{product_name}</span> -          
                          <Variants data={rest} dot={true} />
                        </span>
                        <span>{stock} available</span>
                      </div>
                    </div>
                  ,
                quantity: productCount,
                price,
                ...rest
            }
        })
        setDataSource(data)
    }, [cartData])
    useEffect(() => {
        const amounts = cartData.map(data => data.productCount * parseFloat(data.price) * dayCount);
        var sub = amounts.reduce((a, b) => a + b, 0);
        setSubTotal(sub);
    }, [cartData,dayCount]);
    return (
        <Row>
            <Col lg={16} span={24} className='cart_products'>
                {
                    cartData.length > 0 ?
                        <>
                            <Table
                                pagination={false}
                                dataSource={dataSource}
                                components={{
                                    body: {
                                        cell: CustomCell,
                                    },
                                }}
                            >
                                {
                                    columns.map(({ title, dataIndex, width, render, className }) => <Column
                                        title={title}
                                        dataIndex={dataIndex}
                                        key={title}
                                        width={width}
                                        render={render}
                                        className={className}
                                        onCell={
                                            (record) => ({
                                                dataIndex,
                                                key: record.key,
                                                record,
                                                dayCount
                                            })
                                        }
                                    />)
                                }
                            </Table>
                        </>
                        :
                        <div className="cart-clean">Your cart is empty</div>
                }
            </Col>
            <Col lg={8} span={24}>
                <div className="cart-details-date-time">
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
                            disabledDate={ (current) => current && current < moment().startOf('day')}
                        />
                    </div>
                    <div className="product_list_summery">
                        {
                            cartData.length > 0 ?
                                <>                                    <hr />
                                    <div className="summery_detail">
                                        <span>Subtotal</span>
                                        <span>{subTotal.toFixed(2)}</span>
                                    </div>
                                    <hr />
                                </>
                                :
                                null
                        }
                        {
                            rentalPeriod?.rentalPeriod.length > 0 ?
                                null
                                :
                                <Button size='large' type='primary' danger block>Select a rental period</Button>
                        }
                        <div className="summery_button_group cart_details_button">
                            <Link to="/shop/checkout"><Button size="large" type="primary" block disabled={rentalPeriod?.rentalPeriod.length === 0 || cartData.length === 0 || cartWarning}>Checkout</Button></Link>
                            <Link to="/shop"><Button size="large" type="text" block>Continue Shopping</Button></Link>
                        </div>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

export default ShopCartDetails;