import { Link } from "react-router-dom";


const Banner = () => {




    return (
        <div>
            <div className="carousel w-full mx-auto border-4 border-lime-300 ">
                <div id="slide1" className="carousel-item relative w-full">
                    <div className="hero" style={{ backgroundImage: 'url( https://i.ibb.co/4YLwkSY/Top-Beverage-Companies-in-Bangladesh-800x450.png)' }}>
                        <div className="hero-overlay bg-opacity-60"></div>
                        <div className="hero-content text-center text-neutral-content">
                            <div className="max-w-md">
                                <h1 className="mb-5 text-lime-200 text-5xl font-bold">Elevate Your Thirst with Sparkling Delights</h1>
                                <p className="mb-5 text-lime-200">Quench your thirst with the ultimate refreshment. Our selection of sparkling beverages is here to elevate your drinking experience with a burst of effervescence and a world of flavors.</p>
                                <Link to='/contactUs'><button className="btn text-white bg-lime-600 hover:bg-lime-500">CONTACT US</button></Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a href="#slide4" className="btn btn-circle text-white bg-lime-600 hover:bg-lime-500">❮</a>
                        <a href="#slide2" className="btn btn-circle text-white bg-lime-600 hover:bg-lime-500">❯</a>
                    </div>
                </div>
                <div id="slide2" className="carousel-item relative w-full">
                    <div className="hero" style={{ backgroundImage: 'url(https://i.ibb.co/s291Vx5/allcover2.jpg)' }}>
                        <div className="hero-overlay bg-opacity-60"></div>
                        <div className="hero-content text-center text-neutral-content">
                            <div className="max-w-md">
                                <h1 className="mb-5 text-lime-200 text-5xl font-bold">  Fizz-tastic Flavors Await You</h1>
                                <p className="mb-5 text-lime-200"> Dive into a world of effervescence and discover a spectrum of delightful, fizzy flavors that will tantalize your taste buds. Explore the refreshing universe of carbonated beverages.</p>
                                <Link to='/contactUs'><button className="btn text-white bg-lime-600 hover:bg-lime-500">CONTACT US</button></Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a href="#slide1" className="btn btn-circle text-white bg-lime-600 hover:bg-lime-500">❮</a>
                        <a href="#slide3" className="btn btn-circle text-white bg-lime-600 hover:bg-lime-500">❯</a>
                    </div>
                </div>
                <div id="slide3" className="carousel-item relative w-full">
                    <div className="hero" style={{ backgroundImage: 'url(https://i.ibb.co/pnmmYMx/allcover1.jpg)' }}>
                        <div className="hero-overlay bg-opacity-60"></div>
                        <div className="hero-content text-center text-neutral-content">
                            <div className="max-w-md">
                                <h1 className="mb-5 text-lime-200 text-5xl font-bold">  Bubbly Bliss: Dive into the World of Carbonation</h1>
                                <p className="mb-5 text-lime-200">Experience the pure joy of bubbles as you embark on a journey through our carbonated wonderland. From classic favorites to unique concoctions, we have got the fizzy drinks you will love.</p>
                                <Link to='/contactUs'><button className="btn text-white bg-lime-600 hover:bg-lime-500">CONTACT US</button></Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a href="#slide2" className="btn btn-circle text-white bg-lime-600 hover:bg-lime-500">❮</a>
                        <a href="#slide4" className="btn btn-circle text-white bg-lime-600 hover:bg-lime-500">❯</a>
                    </div>
                </div>
                <div id="slide4" className="carousel-item relative w-full">
                    <div className="hero" style={{ backgroundImage: 'url(    https://i.ibb.co/dDZbsVz/bottles-assorted-pepsico-soft-drinks-poznan-poland-jan-flagship-products-american-multinational-food.webp)' }}>
                        <div className="hero-overlay bg-opacity-60"></div>
                        <div className="hero-content text-center text-neutral-content">
                            <div className="max-w-md">
                                <h1 className="mb-5 text-lime-200 text-5xl font-bold">  Bubbles of Joy: Your Carbonated Journey Begins</h1>
                                <p className="mb-5 text-lime-200">Start your adventure with a sip of pure happiness. Our website is your gateway to exploring a world of bubbly, fizzy, and vibrant carbonated drinks that are bound to bring joy to your palate.</p>
                                <Link to='/contactUs'><button className="btn text-white bg-lime-600 hover:bg-lime-500">CONTACT US</button></Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                        <a href="#slide3" className="btn btn-circle text-white bg-lime-600 hover:bg-lime-500">❮</a>
                        <a href="#slide1" className="btn btn-circle text-white bg-lime-600 hover:bg-lime-500">❯</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;