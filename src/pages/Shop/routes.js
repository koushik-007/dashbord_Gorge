
import Checkout from "../../components/Checkout/Checkout";
import ShopCartDetails from "../../components/ShopCartDetails/ShopCartDetails";
import Shop from "./Shop";

export const routes = [
    {
        path: '/',
        component: <Shop/>,
    },
    {
        path: '/cart-details',
        component: <ShopCartDetails/>,
    },
    {
        path: '/checkout',
        component: <Checkout/>,
    },
]