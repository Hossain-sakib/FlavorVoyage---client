import { useLoaderData } from "react-router-dom";
import CartItem from "./CartItem";
import { useState } from "react";


const Cart = () => {

    const data = useLoaderData();
    const [cart, setCart] = useState(data);

    const handleRemoveItem = (_id) => {
        const updatedCart = cart.filter(item => item._id !== _id);
        setCart(updatedCart);
    }

    return (
        <div>
            <div className="flex  h-[75vh] justify-center items-center ">
                <div className="overflow-x-auto border-4 border-lime-300 ">
                    <table className="table">
                        <thead>
                            <tr className="text-lime-700">
                                <th>Image</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map(item => <CartItem
                                    key={item._id}
                                    item={item}
                                    handleRemoveItem={handleRemoveItem}></CartItem>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Cart;


