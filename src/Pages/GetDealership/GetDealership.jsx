import { Link } from "react-router-dom";

const GetDealership = () => {
    return (
        <div className="border-4 border-lime-300 p-6  space-y-8 flex flex-col">
            <h1 className="text-left text-3xl font-bold pb-4 text-lime-600">Explore Dealership Opportunities?</h1>
            <ul className="list-disc text-lime-500 font-semibold pl-5 flex-grow space-y-4">
                <li> Profitable partnership potential.</li>
                <li>Wide range of products to cater to various preferences.</li>
                <li>Marketing support and materials.</li>
                <li>Comprehensive training and resources.</li>
                <li> High-quality products and standards.</li>
                <li> Brand recognition and customer loyalty.</li>
                <li>Exclusive territorial rights.</li>
                <li>Collaborative and customizable solutions.</li>
                <li>Sustainability initiatives and eco-friendly practices.</li>
                <li> Flexible partnership models.</li>
                <li>Demonstrated growth potential.</li>
                <li>Customer loyalty programs for repeat business.</li>
            </ul>
           <Link to='/getDealership'> <button className="btn text-white bg-lime-600 hover:bg-lime-500">GET DEALERSHIP</button></Link>
        </div>
    );
};

export default GetDealership;