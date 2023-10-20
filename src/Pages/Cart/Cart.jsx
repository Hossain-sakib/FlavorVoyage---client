import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

const Cart = () => {

    const data = useLoaderData();
    const [cartItem,setCartItem]=useState(data);
  

    const handleDelete = (_id) => {
        console.log("deleting", _id);
        Swal.fire({
            title: 'Are you sure?',
            text: "You really want to remove this product from cart?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#c0ca33',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5002/cart/${_id}`, {
                    method: "DELETE",
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount>0) {
                            const remaining = cartItem.filter(item=>item._id!=_id);
                            setCartItem(remaining);
                            Swal.fire(
                                'Deleted!',
                                'Your product has been removed.',
                                'success'
                                )
                            }
                            
                    })

            }
        })
    }

    return (
        <div className="flex h-[75vh] justify-center items-center">
            {cartItem.length > 0 ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="table border-4 border-lime-300 rounded-xl">
                            <thead>
                                <tr className="text-lime-600">
                                    <th>SL</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Brand</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItem.map((element, index) => (
                                    <tr className="hover" key={element._id}>
                                        <th>{index + 1}</th>
                                        <td>{element.name} </td>
                                        <td>{element.type}</td>
                                        <td>{element.brand}</td>
                                        <td>{element.price} Tk.</td>
                                        <td className="">
                                            <button onClick={() => handleDelete(element._id)} className="btn font-bold hover:bg-lime-200 text-lime-700">X</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <h1 className="text-4xl font-bold text-lime-700">Cart is empty</h1>
            )}
        </div>
    );
};

export default Cart;
