import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';

const BrandCard = ({ brand }) => {
    const { name, image } = brand || {};
    useEffect(()=>{
        AOS.init({duration:1000});
    },[])
    return (
        <div>
            <div className="w-72 h-72 card shadow-xl image-full  rounded-xl border-2 border-lime-500" data-aos="fade-up">
                <figure><img src={image} alt="brand" /></figure>
                <div className="card-body">
                    <p className="text-xl text-white hover:text-lime-400">{name}</p>
                </div>
            </div>
        </div>
    );
};

export default BrandCard;