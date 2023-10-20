import { useLoaderData, useParams } from "react-router-dom";
import BrandProductCard from "../BrandProductCard/BrandProductCard";
import Adv from "../Adv.jsx/Adv";
import { useEffect, useState } from "react";


const BrandProduct = () => {
    const [brandProduct, setBrandProduct] = useState(null);
    const { name } = useParams();
    const brands = useLoaderData();

    


    useEffect(() => {
        const filterBrand = brands?.filter(brandProduct=>brandProduct.brand == name);
        setBrandProduct(filterBrand);
    }, [name,brands])
  

    return (
        <div className="space-y-8">

            <div className="border-4 border-lime-300 rounded-lg">
                <Adv></Adv>
            </div>


            {/* cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {
                  brandProduct?.map(product => <BrandProductCard key={product.id}
                        product={product}></BrandProductCard>)
                }
            </div>
        </div>
    );
};

export default BrandProduct;