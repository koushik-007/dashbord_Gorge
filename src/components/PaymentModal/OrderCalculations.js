import React from 'react';

const OrderCalculations = ({orderNumber, price, secuirityDeposit, paid}) => {
    return (
        <div className="paymentModalBox">
        <div className="totals">
            <div>
                <h5>Order {orderNumber}</h5>
                <div className="totals-item">
                    <label>Amount</label>
                    <span className="amount">{price}</span>
                </div>
                <div className="totals-item">
                    <label>Security deposit</label>
                    <span className="amount">{secuirityDeposit ? secuirityDeposit : '0.00'}</span>
                </div>
                <hr />
                <div className="totals-item total">
                    <label><b>Total</b></label>
                    <span className="amount"><b>{price}</b></span>
                </div>
                <div className="totals-item">
                    <label>Paid</label>
                    <span className="amount">{paid ? paid.toFixed(2) : '0.00'}</span>
                </div>
                <hr />
                <div className="totals-item total">
                    <label><b>Outstanding</b></label>
                    <span className="amount"><b>{(price-paid).toFixed(2)}</b></span>
                </div>
            </div>
        </div>
    </div>
    );
};

export default OrderCalculations;