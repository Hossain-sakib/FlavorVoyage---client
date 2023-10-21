import { Outlet } from "react-router-dom";
import Navbar from "../Shared/Navbar/Navbar";
import Footer from "../Shared/Footer/Footer";



const Root = () => {
    return (
        <div className="max-w-7xl mx-auto  flex flex-col  justify-center space-y-8">
            <div>
            <Navbar></Navbar>
            </div>
            <div>
            <Outlet></Outlet>
            <Footer></Footer>
            </div>
        </div>
    );
};

export default Root;