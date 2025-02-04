import { Link } from "react-router-dom";
import lamppostIcon from '../assets/lamppost.png';

const Navbar = () => {
    return (
        <nav className="bg-[#131313] text-white w-screen h-16 flex items-center px-6">
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center logo-container space-x-4">
                    <img
                        src={lamppostIcon}
                        alt="Welcome to LampPost!"
                        className="h-10 w-10"
                    />
                    <h1 className="font-bold bg-gradient-to-l from-[#FF8C01] to-[#C62C2C] bg-clip-text text-transparent">
                        LampPost
                    </h1>
                </div>

                <ul className="flex space-x-6 text-lg ml-auto">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/stats">Stats</Link></li>
                </ul>
                
            </div>
      </nav>
    );
  };

export default Navbar;