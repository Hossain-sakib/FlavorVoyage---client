import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import { CgProfile } from "react-icons/cg";



const Navbar = () => {

    const { user, signOutUser } = useContext(AuthContext);
    const handleSignOut = () => {
        signOutUser()
            .then()
            .catch()
    }
    return (
        <div>
            <div className="navbar rounded border-2 border-lime-500">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost hover:bg-lime-100 lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-2">
                            <li className="btn btn-sm w-full bg-lime-100 text-lime-600  btn-ghost"><NavLink to='/'>Home</NavLink></li>
                            <li className="btn btn-sm w-full bg-lime-100 text-lime-600  btn-ghost"><NavLink to='/addProduct'>Add Product</NavLink></li>
                            <li className="btn btn-sm w-full bg-lime-100 text-lime-600  btn-ghost"><NavLink to='/cart'>My Cart</NavLink></li>
                        </ul>
                    </div>
                    <Link to='/'>
                        <div className="btn btn-ghost hover:bg-lime-100">
                            <img className="w-14" src="https://i.ibb.co/cbsXXHg/flavor-voyage-low-resolution-logo-color-on-transparent-background.png" alt="" />
                        </div>
                    </Link>

                </div>
                <div className="navbar-center hidden lg:flex ">
                    <ul className=" menu-horizontal px-1 gap-4">
                        <li className="btn btn-sm w-36 py-2 bg-lime-100 text-lime-600  btn-ghost"><NavLink to='/'>Home</NavLink></li>
                        <li className="btn btn-sm w-36 py-2  bg-lime-100 text-lime-600  btn-ghost"><NavLink to='/addProduct'>Add Product</NavLink></li>
                        <li className="btn btn-sm w-36 py-2  bg-lime-100 text-lime-600  btn-ghost"><NavLink to='/cart'>My Cart</NavLink></li>
                    </ul>
                </div>
                <div className="navbar-end space-x-1 flex items-center">
                    {
                        user?.email ? <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="rounded-full">
                                    {
                                        user?.photoURL ? <img src={user.photoURL} alt={user.displayName} />
                                            :
                                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                                <div className="w-8 rounded-full  bg-white border hover:border-lime-600 text-black">
                                                    <div className="text-3xl flex items-center justify-center ">
                                                        <CgProfile></CgProfile>
                                                    </div>
                                                </div>
                                            </label>

                                    }
                                </div>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-2">
                                <li>
                                    <button className="btn btn-sm bg-lime-100 text-lime-600 btn-ghost ">{user.displayName}</button>
                                </li>
                                <li>
                                    <button className="btn btn-sm bg-lime-100 text-lime-600  btn-ghost"><Link to='/profileDetails'>Profile details</Link></button>
                                </li>
                            </ul>
                        </div>
                            :
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-8 rounded-full  bg-lime-200 border hover:border-lime-600 text-black">
                                    <div className="text-3xl flex items-center justify-center ">
                                        <CgProfile></CgProfile>
                                    </div>
                                </div>
                            </label>
                    }
                    {
                        user ?
                            <button onClick={handleSignOut} className="btn bg-lime-300 hover:bg-lime-200 font-bold  text-black">SIGN OUT</button>
                            :
                            <Link to='/signIn'>
                                <button className="btn bg-lime-300 hover:bg-lime-200 font-bold  text-black">SIGN IN</button>
                            </Link>

                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;