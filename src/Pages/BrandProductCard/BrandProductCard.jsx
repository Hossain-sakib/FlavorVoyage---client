import 'aos/dist/aos.css';
import AOS from 'aos';
import { AiOutlineStar } from "react-icons/ai";
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const BrandProductCard = ({ product }) => {
    const { _id, image, name, brand, type, price, rating } = product || {};


    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, [])
    return (
        <div>
            <div data-aos="fade-up" className="card  bg-base-100 shadow-xl border-4 border-lime-400 p-4">
                <figure><img className="w-96 h-96" src={image} alt="" /></figure>
                <div className="card-body">
                    <h2 className="">
                        <p className="text-2xl font-semibold text-lime-700">
                            {name}
                        </p>

                    </h2>
                    <p className="text-2xl font-bold">{price} Tk.</p>
                    <div className="card-actions justify-between items-center">
                        <div className="flex items-center gap-2"><AiOutlineStar className='text-lime-700'></AiOutlineStar> {rating}</div>
                        <div className="space-x-2">
                            <div className="badge border border-lime-500">{type}</div>
                            <div className="badge badge-outline bg-lime-300">{brand}</div>
                        </div>
                    </div>
                </div>
                <div className="pt-4  flex flex-col space-y-4">
                    <Link to={`/product/${name}`}><button className="btn w-full border-2 border-lime-400 hover:bg-lime-200 font-bold">See Details</button></Link>

                    <Link to={`/updateProduct/${_id}`}><button className="btn w-full border-2 border-lime-400 hover:bg-lime-200 font-bold">Update Product</button></Link>
                </div>
            </div>
        </div>
    );
};

BrandProductCard.propTypes = {
    product: PropTypes.object
}


export default BrandProductCard;