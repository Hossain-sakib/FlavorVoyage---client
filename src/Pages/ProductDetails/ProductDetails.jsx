import { useEffect, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Details from "./Details";


const ProductDetails = () => {
    const [productDetail,setProductDetail] = useState();
    const {name} = useParams();
    const details = useLoaderData();

    useEffect(()=>{
        const findDetails = details?.find(productDetail => productDetail.name == name);
        setProductDetail(findDetails);
    },[name,details])

    return (
        <div>
            <Details productDetail={productDetail}></Details>
        </div>
    );
};

export default ProductDetails;