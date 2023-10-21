import { AiOutlineStar } from "react-icons/ai";
import Swal from "sweetalert2";
import PropTypes from 'prop-types';


const Details = ({ productDetail }) => {
    const { image, name, brand, type, price, rating, description } = productDetail || {};

    const handleAddCart = () => {
      
        
        fetch('https://flavor-voyage-server-ocr8lwuo5-sakibs-projects-05a313dc.vercel.app/cart', {
            method: "POST",
            headers: {
                "content-type": 'application/json',
            },
            body: JSON.stringify(productDetail)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.insertedId);
                if (data.insertedId) {
                    Swal.fire("Successful!", "Product added to the cart.", 'success')
                }

            })

    }


    return (
        <div>
            <div className="hero min-h-screen bg-base-200 border-4 border-lime-300 rounded">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img src={image} className="w-80 h-92 rounded-lg border border-lime-400 shadow-2xl" />
                    <div>
                        <div className="flex items-center gap-6">
                            <h1 className="text-5xl font-bold text-lime-600">{name}</h1>
                            <p className="text-2xl font-bold">{price} Tk.</p>
                        </div>
                        <p className="py-6">{description}</p>
                        <div className="space-y-6 flex flex-col">
                            <div className="space-x-2">
                                <div className="badge border border-lime-500">{type}</div>
                                <div className="badge badge-outline bg-lime-300">{brand}</div>
                            </div>
                            <div className="flex items-center gap-2 "><AiOutlineStar className='text-lime-700'></AiOutlineStar> {rating}</div>
                            <div>
                                <button onClick={handleAddCart} className="btn text-white bg-lime-600 hover:bg-lime-500">Add to cart</button>
                            </div>
                        </div>

                        

                    </div>
                </div>
            </div>
        </div>
    );
};


Details.propTypes = {
    productDetail: PropTypes.object
}

export default Details;