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
                loader: () => fetch('Brand.json')
            },
            {
                path: '/brandProduct/:name',
                element: <BrandProduct></BrandProduct>,
                loader: () => fetch('https://flavor-voyage-server-ocr8lwuo5-sakibs-projects-05a313dc.vercel.app/product')
            },
            {
                path: '/product/:name',
                element: <PrivateRoute><ProductDetails></ProductDetails></PrivateRoute>,
                loader: () => fetch('https://flavor-voyage-server-ocr8lwuo5-sakibs-projects-05a313dc.vercel.app/product')
            },
            {
                path: '/cart',
                element: <PrivateRoute><Cart></Cart></PrivateRoute>,
                loader: ()=> fetch('https://flavor-voyage-server-ocr8lwuo5-sakibs-projects-05a313dc.vercel.app/cart')
                
            },
            {
                path: '/addProduct',
                element: <PrivateRoute><AddProduct></AddProduct></PrivateRoute>

            },
            {
                path: '/updateProduct/:id',
                element: <PrivateRoute><UpdateProduct></UpdateProduct></PrivateRoute>,
                loader: ({ params }) => fetch(`https://flavor-voyage-server-ocr8lwuo5-sakibs-projects-05a313dc.vercel.app/product/${params.id}`)

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