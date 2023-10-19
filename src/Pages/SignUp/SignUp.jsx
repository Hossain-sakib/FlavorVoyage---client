import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";

const SignUp = () => {
    const [signUpError, setSignUpError] = useState('');
    const [success, setSuccess] = useState('');

    const { signUpUser } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignUp = e => {
        e.preventDefault();

        const form = e.target;
        const name = form.name.value;
        const image = form.image.value;
        const email = form.email.value;
        const password = form.password.value;

        if (password.length < 6) {
            setSignUpError('Password should be at least 6 characters.');
            return;
        }
        else if (!/[A-Z]/.test(password)) {
            setSignUpError('Required at least one uppercase character.');
            return;
        }
        else if (!/[a-z]/.test(password)) {
            setSignUpError('Required at least one lowercase character.');
            return;
        }
        else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)) {
            setSignUpError('Required at least one special character.')
        }

        else if (!/[0-9]/.test(password)) {
            setSignUpError('Required at least one numerical character.');
            return;
        }


        setSignUpError('');
        setSuccess('');

        signUpUser(email, password, name, image)
            .then((res) => {
                navigate(location?.state ? location.state : '/');
                setSuccess("User created successfully.")

            })
            .catch(error => console.error(error))
    }
    return (
        <div>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse border-2 border-lime-500 rounded-lg">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold text-lime-600">Sign Up Now!</h1>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-lime-100 ">
                        <form onSubmit={handleSignUp} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Full Name</span>
                                </label>
                                <input type="text" placeholder="dull name" className="input input-bordered" name="name" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Image URL</span>
                                </label>
                                <input type="text" placeholder="image url" className="input input-bordered" name="image" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Email</span>
                                </label>
                                <input type="email" placeholder="email" className="input input-bordered" name="email" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Create A Password</span>
                                </label>
                                <input type="password" placeholder="password" className="input input-bordered" name="password" required />
                            </div>
                            <div className="form-control mt-6">
                                <button type="submit" className="btn text-white bg-lime-600 hover:bg-lime-500">Sign Up</button>
                            </div>
                        </form>
                        {
                            signUpError && <p className="text-xs text-center text-red-600 p-4">{signUpError}</p>
                        }
                        {
                            success && <p className="text-xs text-center text-green-600">{success}</p>
                        }
                        <p className="text-xs text-lime-600 font-medium text-center mt-4 py-4" >Already have an account? Please<Link to='/signIn' className="hover:underline hover:text-lime-400"> Sign In</Link>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;