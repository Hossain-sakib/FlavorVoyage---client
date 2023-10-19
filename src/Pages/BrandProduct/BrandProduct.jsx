import { useLoaderData } from "react-router-dom";
import BrandProductCard from "../BrandProductCard/BrandProductCard";


const BrandProduct = () => {
    const products = useLoaderData();
    console.log(products)
    return (
        <div>




            {/* cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {
                    products.map(product => <BrandProductCard key={product.id}
                        product={product}></BrandProductCard>)
                }
            </div>
        </div>
    );
};

export default BrandProduct;