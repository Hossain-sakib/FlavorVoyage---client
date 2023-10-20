import { BiLogoFacebook, BiLogoTwitter, BiLogoInstagram } from "react-icons/bi";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <div>
            <footer className="footer footer-center p-10 rounded text-base-content  border-4 border-lime-300 bg-lime-100">
                <nav className="grid grid-flow-col gap-4">
                <Link className="hover:underline hover:text-lime-600" to='/about'>About</Link>
                    <Link className="hover:underline hover:text-lime-600" to='/contact'>Contact</Link>
                    <Link className="hover:underline hover:text-lime-600" to='/partners'>Partners</Link>
                    <Link className="hover:underline hover:text-lime-600" to='/blog'>Blog!</Link>
                    <Link className="hover:underline hover:text-lime-600" to='/faq'>FAQ</Link>
                </nav>
                <nav>
                <div className="grid grid-flow-col gap-4">
                        <a className="text-3xl hover:text-lime-600" href="https://facebook.com/entertainxpert"><BiLogoFacebook></BiLogoFacebook></a>
                        <a className="text-3xl  hover:text-lime-600" href="https://twitter.com/entertainxpert"><BiLogoTwitter></BiLogoTwitter></a>
                        <a className="text-3xl hover:text-lime-600" href="https://instagram.com/entertainxpert"><BiLogoInstagram></BiLogoInstagram></a>
                    </div>
                </nav>
                <aside>
                    <p>Copyright © 2023 - All right reserved by FLAVOR VOYAGE Ltd.</p>
                </aside>
            </footer>
        </div>
    );
};

export default Footer;