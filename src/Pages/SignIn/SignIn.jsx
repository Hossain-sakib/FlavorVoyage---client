import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import { AiOutlineGoogle } from "react-icons/ai";

const SignIn = () => {
    const [signInError, setSignInError] = useState('');
    const [success, setSuccess] = useState('');

    const { signInUser, googleSignIn } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();


    const handleSignIn = e => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const email = form.get('email');
        const password = form.get('password');
        signInUser(email, password)
            .then(res => {
                navigate(location?.state ? location.state : '/');
                setSuccess("User logged in successfully.");
            })
            .catch(error => {
                console.error(error);
                setSignInError(error.message);

            })
    }

    const handleGoogleSignIn = () => {
        googleSignIn()
            .then(result => {
                console.log(result.user);
                navigate("/");
            })
            .catch(error => {
                console.error(error);
            })
    }
    return (
        <div>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse border-2 border-lime-500 rounded-lg">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold text-lime-600">Sign In Now!</h1>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-lime-100 ">
                        <form onSubmit={handleSignIn} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Email</span>
                                </label>
                                <input type="email" placeholder="email" className="input input-bordered" name="email" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Password</span>
                                </label>
                                <input type="password" placeholder="password" className="input input-bordered" name="password" required />
                                <label className="label">
                                    <a className="text-xs text-lime-600 hover:font-medium hover:underline">Forgot password?</a>
                                </label>
                            </div>
                            <div className="form-control mt-6">
                                <button type="submit" className="btn text-white bg-lime-600 hover:bg-lime-500">Sign In</button>
                            </div>
                        </form>
                        {
                            signInError && <p className="text-sm text-center text-red-600 p-4">{signInError}</p>
                        }
                        {
                            success && <p className="text-sm text-center text-green-600">{success}</p>
                        }
                        <div className="flex flex-col text-center items-center justify-center space-y-3 text-black mx-6">
                            <h2 className="text-sm">Continue With Google</h2>
                            <h2 onClick={handleGoogleSignIn} className="text-4xl hover:text-lime-600"><AiOutlineGoogle></AiOutlineGoogle></h2>
                        </div>
                        <p className="text-xs text-lime-600 font-medium text-center mt-4 py-4" >Do not have an account? Please <Link to='/signUp' className="hover:underline hover:text-lime-400">Sign Up</Link>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;