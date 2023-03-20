import { Collapse, Layout } from 'antd';
import "./Dashboard.css";
import Header from '../Header'
import { Typography } from 'antd';

const { Panel } = Collapse;
const { Content, } = Layout;
const {Title} = Typography;
const Dashboard = () => {
    
    const onChange = (key) => {
        console.log(key);
    };
    return (
        <>
         <Header>
           <Title>Dashboard</Title>
        </Header>
        <Content className='main_content'>
            <div
                className="site-layout-background"
                style={{
                    padding: 24,
                    textAlign: 'center'
                }}
            >
                <Collapse defaultActiveKey={['1']} onChange={onChange}>
                    <Panel header={<strong>Premium Plan</strong>} key="1">
                       <div className="widget-content">
                       <h3>welcome back</h3>
                        <div className="steps">
                            <div className="step step-icon step-product clickable ">
                                <span className="step-title">Add a product</span>
                                <span className="step-description">Let's add your first product</span>
                            </div>
                            <div className="step step-icon step-shop clickable ">
                                <span className="step-title">Place an online order</span>
                                <span className="step-description">Make an online reservation</span>
                            </div>
                            <div className="step step-icon step-order clickable ">
                                <span className="step-title">Create an order</span>
                                <span className="step-description">Reserve your products on an order</span>
                            </div>
                        </div>
                       </div>
                    </Panel>
                </Collapse>
            </div>
        </Content>
        </>
    );
};

export default Dashboard;