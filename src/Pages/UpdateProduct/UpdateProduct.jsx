import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";


const UpdateProduct = () => {
    const product = useLoaderData();
    const { _id, image, name, brand, type, price, description, rating } = product;


    
    const handleUpdateProduct = e => {
        e.preventDefault();
        const form = e.target;
        const image = form.image.value;
        const name = form.name.value;
        const brand = form.brand.value;
        const type = form.type.value;
        const price = form.price.value;
        const description = form.description.value;
        const rating = form.rating.value;

        const updatedProduct = {image,name,brand,type,price,description,rating}



        fetch(`http://localhost:5002/product/${_id}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.modifiedCount>0) {
                    Swal.fire({
                        title: 'Success',
                        text: 'Product Updated Successfully!',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    })
                }
            })
    }
    return (
        <div>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse border-4 border-lime-300 rounded-lg">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold text-lime-600">Update Product!</h1>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-lime-100">
                        <form onSubmit={handleUpdateProduct} className="card-body">
                            {/* image */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Image </span>
                                </label>
                                <input type="text" name="image" defaultValue={image} placeholder="image url" className="input input-bordered" required />
                            </div>
                            {/* name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Name</span>
                                </label>
                                <input type="text" name="name" defaultValue={name} placeholder="product name" className="input input-bordered" required />
                            </div>
                            {/* brand name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Brand</span>
                                </label>
                                <input type="text" name="brand" defaultValue={brand} placeholder="brand name" className="input input-bordered" required />
                            </div>
                            {/* type */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Type</span>
                                </label>
                                <input type="text" name="type" defaultValue={type} placeholder="type of product" className="input input-bordered" required />
                            </div>
                            {/* price */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Price</span>
                                </label>
                                <input type="text" name="price" defaultValue={price} placeholder="price" className="input input-bordered" required />
                            </div>
                            {/* short description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Description</span>
                                </label>
                                <input type="text" name="description" defaultValue={description} placeholder="description" className="input input-bordered" required />
                            </div>
                            {/* rating */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Rating</span>
                                </label>
                                <input type="text" name="rating" defaultValue={rating} placeholder="rating" className="input input-bordered" required />
                            </div>
                            <div className="form-control mt-6">
                                <button type="submit" className="btn text-white bg-lime-600 hover:bg-lime-500">UPDATE PRODUCT</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;