import React, { useContext } from 'react';
import { Menu, Popover, Layout, Button } from "antd";
import "./Sidebar.css";
import { NavLink, useLocation } from 'react-router-dom';
import { routes } from './routes';
import { AuthContextProvider } from '../../context/AuthContext';

const { Sider } = Layout;
const Sidebar = () => {
    const { logout } = useContext(AuthContextProvider)
    const { pathname } = useLocation();
    const paths = pathname.split('/');
    const items = routes.map(({ path, popover, icon }) => {
        if (path === "logout") {
            return ({
                key: String(path),
                label: <Popover destroyTooltipOnHide={{ keepParent: false }} overlayClassName='sidebarPopover' placement='right' content={popover[0]} key={path}>
                    <Button onClick={logout} type='text' icon={icon}/>
                </Popover>
            }) 
        }
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
                defaultSelectedKeys={[paths[2]]}
                selectedKeys={[ paths[2] === 'bundles' ? 'products' : `${paths[2]}`]}
                items={items}
            />
        </Sider>
    );
};

export default Sidebar;