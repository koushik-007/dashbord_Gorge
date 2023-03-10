import React from 'react';
import { Menu, Popover, Layout } from "antd";
import "./Sidebar.css";
import { NavLink, useLocation } from 'react-router-dom';
import { routes } from './routes';

const { Sider } = Layout;
const Sidebar = () => {
    const { pathname } = useLocation();
    const paths = pathname.split('/');
    const items = routes.map(({ path, popover, icon }) => {
        if (popover.length > 1) {
            const content = popover.map(({ name, icon }, index) => (
                <p className='pop' key={index}> {icon} &nbsp;&nbsp; {name}</p>
            ));
            return ({
                key: String(path),
                label:
                    <>
                        <Popover destroyTooltipOnHide={{ keepParent: false }} overlayClassName='sidebarPopover' placement='rightBottom' content={content} key={path}>
                            <NavLink to={path}>{icon} </NavLink>
                        </Popover>
                    </>
            })
        }
        return ({
            key: String(path),
            label: <Popover destroyTooltipOnHide={{ keepParent: false }} overlayClassName='sidebarPopover' placement='right' content={popover[0]} key={path}>
                <NavLink to={path}>{icon}</NavLink>
            </Popover>
        })
    })
    return (
        <Sider className="custom-sidebar">
            <Menu
                style={{ width: "61px" }}
                theme="light"
                mode="inline"
                defaultSelectedKeys={[pathname]}
                selectedKeys={[ paths[1] === 'bundles' ? '/products' : `/${paths[1]}`]}
                items={items}
            />
        </Sider>
    );
};

export default Sidebar;