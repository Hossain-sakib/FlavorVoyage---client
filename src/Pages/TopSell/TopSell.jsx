const TopSell = () => {
    return (
        <div className="rounded-lg border-2 border-lime-500 p-6 bg-lime-100">
            <h1 className="text-center text-3xl font-bold pb-4 text-lime-600">Drinks Of The Month</h1>
            <div className="carousel w-full">
                <div id="item1" className="carousel-item w-full">
                    <img src="https://i.ibb.co/fM2Ppc6/speed.jpg" className="w-full" />
                </div>
                <div id="item2" className="carousel-item w-full">
                    <img src="https://i.ibb.co/vwQVgTz/lemu.jpg" className="w-full" />
                </div>
                <div id="item3" className="carousel-item w-full">
                    <img src="https://i.ibb.co/B6JWqw8/frutika2.jpg" className="w-full" />
                </div>
                <div id="item4" className="carousel-item w-full">
                    <img src="https://i.ibb.co/r2RGtL9/dew.jpg" className="w-full" />
                </div>
            </div>
            <div className="flex justify-center w-full py-2 gap-2">
                <a href="#item1" className="btn text-white bg-lime-500 hover:bg-lime-400 btn-xs">1</a>
                <a href="#item2" className="btn text-white bg-lime-500 hover:bg-lime-400 btn-xs">2</a>
                <a href="#item3" className="btn text-white bg-lime-500 hover:bg-lime-400 btn-xs">3</a>
                <a href="#item4" className="btn text-white bg-lime-500 hover:bg-lime-400 btn-xs">4</a>
            </div>
        </div>
    );
};

export default TopSell;