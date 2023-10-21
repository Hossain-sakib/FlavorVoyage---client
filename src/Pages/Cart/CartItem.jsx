import Swal from "sweetalert2";
import PropTypes from 'prop-types';


const CartItem = ({ item, handleRemoveItem }) => {
    const { _id, name, brand, type, price, image } = item || {};


    const handleRemove = _id => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to remove this product from cart!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, remove it!'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`https://flavor-voyage-server-ocr8lwuo5-sakibs-projects-05a313dc.vercel.app/cart/${_id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        if (data.deletedCount > 0) {
                            handleRemoveItem(_id);
                            Swal.fire(
                                'Deleted!',
                                'Your product has been removed from cart.',
                                'success'
                            )
                        }
                    })
            }
        })

    }

    return (
        <tr className="hover">
            <td><img className="w-10 flex items-center justify-center" src={image} alt="" /></td>
            <td>{name} </td>
            <td>{type}</td>
            <td>{brand}</td>
            <td>{price} Tk.</td>
            <td className="">
                <button onClick={() => handleRemove(_id)} className="btn font-bold hover:bg-lime-200 text-lime-700">X</button>
            </td>
        </tr>
    );
};


CartItem.propTypes = {
    item: PropTypes.object,
    handleRemoveItem: PropTypes.func
}

export default CartItem;

