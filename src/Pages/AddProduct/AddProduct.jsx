

const AddProduct = () => {
    return (
        <div>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse border-2 border-lime-500 rounded-lg">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold text-lime-600">Add Product!</h1>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <form className="card-body">
                            {/* image */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Image </span>
                                </label>
                                <input type="text" placeholder="image url" className="input input-bordered" required />
                            </div>
                            {/* name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Name</span>
                                </label>
                                <input type="text" placeholder="product name" className="input input-bordered" required />
                            </div>
                            {/* brand name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Brand</span>
                                </label>
                                <input type="text" placeholder="brand name" className="input input-bordered" required />
                            </div>
                            {/* type */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Type</span>
                                </label>
                                <input type="text" placeholder="type of product" className="input input-bordered" required />
                            </div>
                            {/* price */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Price</span>
                                </label>
                                <input type="text" placeholder="price" className="input input-bordered" required />
                            </div>
                            {/* short description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Description</span>
                                </label>
                                <input type="text" placeholder="description" className="input input-bordered" required />
                            </div>
                            {/* rating */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Rating</span>
                                </label>
                                <input type="text" placeholder="rating" className="input input-bordered" required />
                            </div>
                            <div className="form-control mt-6">
                                <button type="submit" className="btn text-white bg-lime-600 hover:bg-lime-500">ADD PRODUCT</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;