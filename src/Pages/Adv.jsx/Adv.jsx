

const Adv = () => {
    return (
        <div >
            <div className="carousel w-full">
                <div id="item1" className="carousel-item w-full">
                    <img src="https://i.ibb.co/ySkgsX3/7up.jpg" className="w-full" />
                </div>

                <div id="item2" className="carousel-item w-full">
                    <img src="https://i.ibb.co/BtcgvfJ/cocacola.jpg" className="w-full" />
                </div>
                <div id="item3" className="carousel-item w-full">
                    <img src="https://i.ibb.co/QvNT1Yt/speed-ad.png" className="w-full" />
                </div>
                <div id="item4" className="carousel-item w-full">
                    <img src="https://i.ibb.co/P4XwNVf/sprite.jpg" className="w-full" />
                </div>

            </div>
            <div className="flex justify-center w-full py-2 gap-2">
                <a href="#item1" className="btn btn-xs">1</a>
                <a href="#item2" className="btn btn-xs">2</a>
                <a href="#item3" className="btn btn-xs">3</a>
                <a href="#item4" className="btn btn-xs">4</a>
            </div>
        </div>
    );
};

export default Adv;