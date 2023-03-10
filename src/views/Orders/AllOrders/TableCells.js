import React from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentStatusColumn from './PaymentStatusColumn';


const TableCells = ({ record, routing, children, dataIndex, ...restProps }) => {
  let navigate = useNavigate();

  if (routing) {
    return <td {...restProps} onClick={() => navigate(`/orders/${record.key}`)}>
      {children}
    </td >
  }
  if (dataIndex === 'paymentStatus') {
    return (
      <td {...restProps}>
        <PaymentStatusColumn record={record} />
      </td>
    )
  }
  return <td {...restProps}>
    {children}
  </td>
};
export default TableCells;