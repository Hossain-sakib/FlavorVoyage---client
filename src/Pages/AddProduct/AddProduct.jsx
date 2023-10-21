import Swal from "sweetalert2";

const AddProduct = () => {
    const handleAddProduct = e => {
        e.preventDefault();
        const form = e.target;
        const image = form.image.value;
        const name = form.name.value;
        const brand = form.brand.value;
        const type = form.type.value;
        const price = form.price.value;
        const description = form.description.value;
        const rating = form.rating.value;

        const newProduct = { image, name, brand, type, price, description, rating };
        console.log(newProduct);

        fetch('https://flavor-voyage-server-ocr8lwuo5-sakibs-projects-05a313dc.vercel.app/product',{
            method: 'POST',
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify(newProduct)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if(data.insertedId){
                    Swal.fire({
                        title:'Success',
                        text:'Product Added Successfully!',
                        icon:'success',
                        confirmButtonText:'Ok'
                      })
                }
            })
    }
    return (
        <div>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row-reverse border-2 border-lime-500 rounded-lg">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold text-lime-600">Add Product!</h1>
                    </div>
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-lime-100">
                        <form onSubmit={handleAddProduct} className="card-body">
                            {/* image */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Image </span>
                                </label>
                                <input type="text" name="image" placeholder="image url" className="input input-bordered" required />
                            </div>
                            {/* name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Name</span>
                                </label>
                                <input type="text" name="name" placeholder="product name" className="input input-bordered" required />
                            </div>
                            {/* brand name */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Brand</span>
                                </label>
                                <input type="text" name="brand" placeholder="brand name" className="input input-bordered" required />
                            </div>
                            {/* type */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Type</span>
                                </label>
                                <input type="text" name="type" placeholder="type of product" className="input input-bordered" required />
                            </div>
                            {/* price */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Price</span>
                                </label>
                                <input type="text" name="price" placeholder="price" className="input input-bordered" required />
                            </div>
                            {/* short description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Description</span>
                                </label>
                                <input type="text" name="description" placeholder="description" className="input input-bordered" required />
                            </div>
                            {/* rating */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-lime-600">Rating</span>
                                </label>
                                <input type="text" name="rating" placeholder="rating" className="input input-bordered" required />
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