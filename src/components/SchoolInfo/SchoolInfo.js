import React, { useState, useEffect, useMemo } from 'react';
import { Button, Col, Layout, Row, Skeleton, Table, Typography } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { collection, doc, query, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db, getAData, getAllData } from '../../Firebasefunctions/db';
import Header from "../Header";
import ReactToPrint from 'react-to-print';
import Variants from '../Variants/Variants';
import CustomSpinner from '../CustomSpinner/CustomSpinner';
import moment from 'moment';

const { Content } = Layout;
const { Title } = Typography;
const columns = [
    {
        title: '',
        dataIndex: 'index',
        width: 80,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: 80,
    },
    {
        title: 'Size',
        dataIndex: 'size',
        width: 400
    },
];
const SchoolInfo = () => {
    const { orderId } = useParams();
    const [loading, setLoading] = useState(false);
    const [schoolinfo, setSchoolInfo] = useState({});
    
    const schoolinfoDocRef = collection(db, "student_collections");

    const getSchoolData = async () => {
        setLoading(true);
        const q = query(schoolinfoDocRef, where("orderId", "==", orderId))
        const data = await getAllData(q);        
        setSchoolInfo(data[0]);
        setLoading(false);
    }
    const dataSource = useMemo(()=> {
        const data = schoolinfo?.students?.map(({firstName, lastName, size}, index)=> ({
            key: index,
            index: index+1,
            name: <span>{firstName} {lastName}</span>,
            size,
        }))
        return data
    }, [schoolinfo])
    useEffect(() => {
        getSchoolData();
    }, []);
    const componentRef = React.useRef(null);
    const reactToPrintTrigger = React.useCallback(() => {
        return (
            <Button disabled={loading} icon={<PrinterOutlined />} size="large">Print/Download</Button>
        );
    }, []);
    const reactToPrintContent = React.useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    
    if (!loading) {
        return <>
            <Header>
                <div className='order-header'>
                    <div>
                        <Title>School Info </Title>
                    </div>
                    <div>
                        <ReactToPrint
                            trigger={reactToPrintTrigger}
                            content={reactToPrintContent}
                        />
                    </div>
                </div>
            </Header>
            <Content className='main_content'>
                <Row>
                    <Col span={18} offset={2} className='slip'>
                        <div id='divToPrint' className="content" ref={componentRef}>
                            <Row align="start" className='content-row'>
                                <Col span={15}>
                                    <h3>{schoolinfo?.schoolName}</h3>
                                    <div>{schoolinfo?.teacherName}</div>
                                </Col>
                                <br />
                                
                                <Col span={24}>
                                    <br />
                                    {
                                        schoolinfo?.students?.length > 0 &&
                                        <Table
                                        loading={loading}
                                        pagination={false}
                                        dataSource={dataSource}
                                        columns={columns}
                                    />
                                    }
                                    
                                </Col>
                                
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Content>
        </>
    }
    return (
        <div className="order-edit-loading">
            <CustomSpinner />
        </div>
    )
};

export default SchoolInfo;