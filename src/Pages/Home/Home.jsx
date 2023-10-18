import { useLoaderData } from "react-router-dom";
import Banner from "../../Shared/Banner/Banner";
import BrandCard from "../BrandCard/BrandCard";
import TopSell from "../TopSell/TopSell";
import GetDealership from "../GetDealership/GetDealership";


const Home = () => {
    const brands = useLoaderData();
    return (
        <div className="space-y-8" >
            <div>
                <Banner></Banner>
            </div>

            <div className="flex flex-col items-center justify-center rounded border-2 border-lime-500 pb-8" >
                <h1 className="text-center font-bold text-lime-600 text-4xl my-8">
                    Explore Our Refreshing Brands
                </h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {
                        brands.map(brand => <BrandCard key={brand.id} brand={brand}></BrandCard>)
                    }
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <TopSell></TopSell>
                <GetDealership></GetDealership>
            </div>
        </div>
    );
};

export default Home;