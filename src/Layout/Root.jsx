import { Outlet } from "react-router-dom";


const Root = () => {
    return (
        <div className="max-w-7xl mx-auto px-2">
            <h2>nav</h2>
            <Outlet></Outlet>
        </div>
    );
};

export default Root;