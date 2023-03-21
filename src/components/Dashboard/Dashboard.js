import { Collapse, Layout } from 'antd';
import "./Dashboard.css";
import Header from '../Header'
import { Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Panel } = Collapse;
const { Content, } = Layout;
const { Title } = Typography;
const Dashboard = () => {

    const onChange = (key) => {
        console.log(key);
    };
    const buttonscollection = [
        {
            button: 'Add products',
            type: 'step-product',
            path: 'products/new',
            description: "Let's add your first product"
        },
        {
            button: 'Add bundles',
            type: 'step-shop',
            path: 'bundles/new',
            description: "Let's add your first bundle"
        },
        {
            button: 'View orders',
            type: 'step-order',
            path: 'orders',
            description: "View your orders"
        },
        {
            button: 'View Calendar',
            type: 'step-product',
            path: 'calendar',
            description: "View Calendar"
        },
        {
            button: 'View invoices',
            type: 'step-shop',
            path: 'documents',
            description: "View your invoices"
        },
        {
            button: 'View customers',
            type: 'step-order',
            path: 'customers',
            description: "View your customers"
        }
    ]

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
                                    {
                                        buttonscollection.map(({ button, type, path, description }, key) =>
                                        (
                                            <Link to={path} key={key} >
                                                <button className={`step step-icon ${type}`}>
                                                <span className="step-title">{button}</span>
                                                <span className="step-description">{description}</span>
                                            </button>
                                            </Link>
                                        ))
                                    }                                   
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