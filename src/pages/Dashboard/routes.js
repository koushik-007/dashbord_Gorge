import Dashboard from "../../components/Dashboard/Dashboard";
import Orders from "../../views/Orders/Orders";
import Calendar from "../../views/Calendar/Calendar";
import AddNewProducts from "../../views/Products/AddNewProducts/AddNewProducts";
import Products from "../../views/Products/Products/Products";
import AddNewBundles from "../../views/Products/AddNewBundles/AddNewBundles";
import Customers from "../../views/Customers/Customers";
import AddCustomer from "../../views/Customers/AddCustomer/AddCustomer";
import AddOrder from "../../views/Orders/AddOrder/AddOrder";
import ProductsDetails from "../../views/Products/ProductsDetails/ProductsDetails";
import BundlesDetails from "../../views/Products/BundlesDetails/BundlesDetails";
import CustomerDetails from "../../views/Customers/CustomerDetails/CustomerDetails";
import EditOrder from "../../views/Orders/EditOrder/EditOrder";
import PackingSlip from "../../components/PackingSlip/PackingSlip";
import Documents from "../../views/Documents/Documents";
import Invoices from "../../components/Invoices/Invoices";
import SchoolInfo from "../../components/SchoolInfo/SchoolInfo";

export const routes = [
    {
        path: '/',
        component: <Dashboard/>,
    },
    {
        path: '/orders',
        component: <Orders/>,
    },
    {
        path: '/orders/new',
        component: <AddOrder/>,
    },
    {
        path: '/orders/:orderId',
        component: <EditOrder/>,
    },
    {
        path: '/orders/:orderId/packing_slip',
        component: <PackingSlip/>,
    },
    {
        path: '/Calendar',
        component: <Calendar/>,
    },
    {
        path: '/documents/*',
        component: <Documents/>,
    },
    {
        path: '/documents/invoices/:orderId',
        component: <Invoices/>,
    },
    {
        path: '/documents/schoolinfo/:orderId',
        component: <SchoolInfo />
    },
    {
        path: '/Customers',
        component: <Customers/>,
    },
    {
        path: '/Customers/new',
        component: <AddCustomer/>,
    },
    {
        path: '/customers/details/:id/*',
        component: <CustomerDetails/>,
    },
    {
        path: '/Products',
        component: <Products/>,
    },
    {
        path: '/products/details/:id/*',
        component: <ProductsDetails/>
    },
    {
        path: '/Bundles',
        component: <Products/>,
    },
    {
        path: '/bundles/details/:id/*',
        component: <BundlesDetails/>
    },
    {
        path: '/Products/new',
        component: <AddNewProducts/>,
    },
    {
        path: '/Bundles/new',
        component: <AddNewBundles/>,
    },
]