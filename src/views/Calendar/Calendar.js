import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { Layout, Typography, Badge } from 'antd';
import { Calendar as FullCalendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import enUS from 'date-fns/locale/en-US';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../Firebasefunctions/db';
import CustomSpinner from '../../components/CustomSpinner/CustomSpinner';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Content } = Layout;

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const Calendar = () => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const createEvents = (orderNumber, start, end, orderId) => {
    return {
      title: `order number #${orderNumber}`,
      start: new Date(start),
      end: new Date(end),
      allDay: false,
      orderId,
    }
  }


  const orderCollRef = collection(db, "orders_collections");
  useEffect(()=> {
    setLoading(true);
   try {
    const orders = query(orderCollRef);
    onSnapshot(orders, (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const {orderNumber, rentalPeriod } = doc.data();
          return createEvents(orderNumber, rentalPeriod[0], rentalPeriod[1], doc.id)
        });
        setLoading(false);
        setAllEvents(data);
    })
   } catch (error) {
    setLoading(false)
   }
  },[]);
  function handleSelectEvent(params) {
    navigate('/orders/'+ params.orderId)
  } 
  return (
    <>
      <Header>
        <Title>Calendar</Title>
      </Header>
      <Content className='content_design main_content'>
        {
          loading ?
          <div className="order-edit-loading">
            <CustomSpinner />
        </div>
          :
          <FullCalendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          style={{ height: 500 }}
        />
        }
      </Content>
    </>
  );
};

export default Calendar;