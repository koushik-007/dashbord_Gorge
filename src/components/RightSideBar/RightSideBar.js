import React from 'react';
import { Col, Collapse, Layout, Row } from 'antd';
import { NavLink } from 'react-router-dom';
import { TiDocumentText } from 'react-icons/ti';
import { HiOutlineDocumentDuplicate } from 'react-icons/hi'
import "./RightSideBar.css";

const { Sider } = Layout;
const { Panel } = Collapse;

const RightSideBar = ({orderId}) => {
    
    return (
        <Sider theme="light" className='custom-rightSidebar'>
            <Row>
                <Col>
                    <Collapse
                        defaultActiveKey={['1']}
                        destroyInactivePanel={true}
                        expandIconPosition={"end"}
                    >
                        <Panel header={<b>Documents</b>} key="1">
                            <NavLink to="packing_slip" className="packing_link">
                                <TiDocumentText />
                                <span>Packing slip</span>
                            </NavLink>
                        </Panel>
                        <Panel header={<b>Invoices (1)</b>} key="2">
                        <NavLink to={`/documents/invoices/${orderId}`} className="invoices_link">
                                <HiOutlineDocumentDuplicate />
                                <span>Pro forma</span>
                            </NavLink>
                        </Panel>
                    </Collapse>
                </Col>
            </Row>
        </Sider>
    );
};

export default RightSideBar;