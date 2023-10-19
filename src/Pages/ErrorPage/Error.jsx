import { Link } from "react-router-dom";

const Error = () => {
    return (
        <div className='min-h-screen text-center flex flex-col justify-center align-middle'>
            <h1 className='text-7xl text-lime-600 font-bold'>
                404
            </h1>

            <h2 className='text-5xl text-lime-600 font-bold mb-24'>
                NOT FOUND
            </h2>

            <h1 className="text-2xl underline text-red-600">Go back to <Link to="/">Homepage</Link></h1>
        </div>
    );
};

export default Error;