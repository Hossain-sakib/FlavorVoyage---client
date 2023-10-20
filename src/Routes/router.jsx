import {
    createBrowserRouter,
} from "react-router-dom";
import Root from "../Layout/Root";
import Home from "../Pages/Home/Home";
import SignIn from "../Pages/SignIn/SignIn";
import SignUp from "../Pages/SignUp/SignUp";
import AddProduct from "../Pages/AddProduct/AddProduct";
import PrivateRoute from "./PrivateRoute";
import Error from "../Pages/ErrorPage/Error";
import BrandProduct from "../Pages/BrandProduct/BrandProduct";
import UpdateProduct from "../Pages/UpdateProduct/UpdateProduct";
import ProductDetails from "../Pages/ProductDetails/ProductDetails";
import Cart from "../Pages/Cart/Cart";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root></Root>,
        errorElement: <Error></Error>,
        children: [
            {
                path: '/',
                element: <Home></Home>,
                loader: () => fetch('../../public/Brand.json')
            },
            {
                path: '/brandProduct/:name',
                element: <PrivateRoute><BrandProduct></BrandProduct></PrivateRoute>,
                loader: () => fetch('http://localhost:5002/product')
            },
            {
                path: '/product/:name',
                element: <PrivateRoute><ProductDetails></ProductDetails></PrivateRoute>,
                loader: () => fetch('http://localhost:5002/product')
            },
            {
                path: '/cart',
                element: <PrivateRoute><Cart></Cart></PrivateRoute>,
                loader: ()=> fetch('http://localhost:5002/cart')
                
            },
            {
                path: '/addProduct',
                element: <PrivateRoute><AddProduct></AddProduct></PrivateRoute>

            },
            {
                path: '/updateProduct/:id',
                element: <PrivateRoute><UpdateProduct></UpdateProduct></PrivateRoute>,
                loader: ({ params }) => fetch(`http://localhost:5002/product/${params.id}`)

            },

            {
                path: '/signIn',
                element: <SignIn></SignIn>
            },
            {
                path: '/signUp',
                element: <SignUp></SignUp>
            },
        ]
    }
]);
export default router;