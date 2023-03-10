import React, { useState, useEffect, useContext } from 'react';
import { Button, Col, Row } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { BsPencil } from 'react-icons/bs';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebasefunctions/db';
import { PriceContextProvider } from '../../context/PriceContext';

const OrderInvoic = ({ productsData, orderId }) => {
  const {setPrice} = useContext(PriceContextProvider);
  const [showDropdown, setShowDropdown] = useState(false);
  const [total, setToal] = useState(0);
  useEffect(() => {
    const subTotal = async () => {
      const charges = productsData.map(data => parseFloat(data.charge) * parseFloat(data.quantity));
      var total = charges.reduce((a, b) => a + b, 0);
      setToal(total);
      setPrice(total);
      if (orderId) {
        const orderDocRef = doc(db, "orders_collections", orderId);
        await updateDoc(orderDocRef, { price: total })
      }
    }
    subTotal();
  }, [productsData]);
  return (
    <Row>
      <Col lg={12} xs={24}>
        <div className="custom-dropdown">
          <span onClick={() => setShowDropdown(!showDropdown)} onBlur={() => setShowDropdown(!showDropdown)}>
            <button label="Add custom line" type="button" >
              <span>Add custom line</span>
              {
                showDropdown ? <UpOutlined /> : <DownOutlined />
              }
            </button>
          </span>
          {
            showDropdown &&
            <div width="168px" className="options">
              <span className="option">Charge</span>
              <span className="option">Section</span>
            </div>
          }
        </div>
      </Col>
      <Col lg={12} xs={24}>
        <div className="calculation-box">
          <div className="calculation-details">Subtotal</div>
          <div className="calculation-details">{total}</div>
          <div className="calculation-details">
              <span> Add a discount</span>
          </div>
          <div data-tid="Discount amount" className="calculation-details"></div>
          <div className="calculation-details">
              <span>Add a coupon</span>
          </div>
          <div className="calculation-details"></div>
          <div className="discount">Total discount</div>
          <div className="discount">0.00</div>
          <div className="calculation-details">
            <b className="B-fMBjPb kgbybm">Total incl. taxes</b>
          </div>
          <div className="calculation-details">
            <b>{total}</b>
          </div>
          <div className="calculation-details">Security deposit</div>
          <div className="calculation-details">0.00
            <Button icon={<BsPencil />} />
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default OrderInvoic;