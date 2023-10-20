import { AiOutlineStar } from "react-icons/ai";


const Details = ({ productDetail }) => {
    const { _id, image, name, brand, type, price, rating, description } = productDetail || {};


    return (
        <div>
            <div className="hero min-h-screen bg-base-200 border-2 border-lime-400 rounded">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img src={image} className="w-80 h-92 rounded-lg border border-lime-400 shadow-2xl" />
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-5xl font-bold text-lime-600">{name}</h1>
                            <p className="text-2xl font-bold">{price} Tk.</p>
                        </div>
                        <p className="py-6">{description}</p>
                        <div className="space-x-2 space-y-6">
                            <div className="badge border border-lime-500">{type}</div>
                            <div className="badge badge-outline bg-lime-300">{brand}</div>
                            <div className="flex items-center gap-2 "><AiOutlineStar className='text-lime-700'></AiOutlineStar> {rating}</div>
                            <button className="btn border-2 border-lime-400 hover:bg-lime-200 font-bold  text-black">Add to cart</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;