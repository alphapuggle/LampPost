import darkAlley from "../assets/darkAlley.jpg";
import { FaSearch } from "react-icons/fa";


const Home = () => {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden bg-cover bg-center flex-auto"
      style={{ backgroundImage: `url(${darkAlley})` }}
    >
      <div className="min-h-screen w-full flex flex-col items-center pb-12" 
           style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(4px)" }}>

        <div className=" text-white text-center h-1 w-screen bg-gradient-to-r from-[#C62C2C]/50 to-[#FF8C01]/50">
        </div>

        <div className="mx-auto text-center px-8 py-12 mt-45 mb-5 bg-[#333333]/65 rounded-lg shadow-lg max-w-4xl">
            <h2 className="text-white text-5xl md:text-7xl font-bold tracking-wide leading-tight">
                Stay Informed. Stay Safe.
            </h2>
            <p className="text-gray-300 text-lg md:text-2xl mt-6 leading-relaxed">
                LampPost empowers communities with real-time crime data, offering an 
                interactive heat map and the most up-to-date reports. Stay aware, report incidents, 
                and explore detailed statistics to keep Pennsylvania safe.
            </p>
        </div>


        <div className="w-3/4 md:w-1/2 mt-6">
            <div className="flex items-center w-full p-4 pl-4 rounded-full border border-gray-300 shadow-lg focus-within:ring-2 focus-within:ring-[#FF8C01] bg-white">
                <FaSearch className="text-gray-500 text-xl" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 p-2 pl-4 text-lg text-gray-400 placeholder-gray-400 bg-transparent focus:outline-none"
                />
            </div>
        </div>

        <div className="flex-grow"></div>
        <div className=" text-white text-center h-1 w-screen bg-gradient-to-r from-[#FF8C01]/50 to-[#C62C2C]/50">
        </div>
        <div className=" bg-black w-screen h-19 text-gray-300 text-left py-4 shadow-lg">
            <p className="text-lg ml-3">© 2025 LampPost. All Rights Reserved.</p>
        </div>



        {/* <div 
          className="h-52 mx-auto bg-center bg-contain bg-no-repeat rounded-lg mt-8"
          style={{ backgroundImage: `url(${paFlag})` }}>
        </div>

        <div 
          className="w-3/5 h-40 mx-auto bg-center bg-contain bg-no-repeat mt-8"
          style={{ backgroundImage: `url(${streetLt2})` }}>
        </div> */}
      </div>
    </div>
  );
};

export default Home;