import { Link, NavLink } from "react-router-dom";



const Navbar = () => {
    const navLinks =
        <>
            <li><NavLink to='/'>Home</NavLink></li>
            <li><NavLink to='/'>Add Product</NavLink></li>
            <li><NavLink to='/'>My Cart</NavLink></li>
        </>
    return (
        <div>
            <div className="navbar rounded border-2 border-lime-500">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost hover:bg-lime-100 lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu dropdown-content space-y-2  z-[1] shadow bg-lime-100 rounded-box w-52">
                            {
                                navLinks
                            }
                        </ul>
                    </div>
                    <Link to='/'>
                        <div className="btn btn-ghost hover:bg-lime-100">
                            <img className="w-14" src="https://i.ibb.co/cbsXXHg/flavor-voyage-low-resolution-logo-color-on-transparent-background.png" alt="" />
                        </div>
                    </Link>

                </div>
                <div className="navbar-center hidden lg:flex ">
                    <ul className="menu menu-horizontal px-1 gap-4">
                        {
                            navLinks
                        }
                    </ul>
                </div>
                <div className="navbar-end">
                    <a className="btn bg-lime-300 font-bold  hover:bg-lime-200">Login</a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;