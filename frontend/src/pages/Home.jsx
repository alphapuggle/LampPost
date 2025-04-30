import { useState } from "react";
import darkAlley from "../assets/darkAlley.jpg";
import streetLt2 from "../assets/streetlight2.png";
import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResultsList";
import Carousel from "../components/Carousel";
import { useNavigate } from 'react-router-dom';  



const Home = () => {
const [results, setResults] = useState([]);
const [selectedResult, setSelectedResult] = useState(null);  // State for selected result
const navigate = useNavigate();  // To navigate to Stats page

const handleResultClick = (result) => {
    setSelectedResult(result);  // Store the selected result
    navigate("/stats", { state: { selectedResult: result } });  // Pass it to the stats page
}

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${darkAlley})`, backgroundAttachment: "scroll" }}
    >
      {/* Full-page Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-lg"></div>

      {/* Centered Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl px-4 gap-8">
        
        {/* Header */}
        <div className="text-white text-center">
          <h1 className="text-3xl">Welcome to LampPost</h1>
          <p className="mt-2 text-lg">Shine some light on your local crime!</p>
        </div>

        {/* Our Mission */}
        <div className="text-4xl tracking-widest bg-gradient-to-r from-[#C62C2C] to-[#FF8C01] p-4 rounded-lg text-center text-white">
          Our Mission:
        </div>


        {/* Mission Description and Logos */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between text-center gap-4">
          {/* Left Logo */}
          <div
            className="w-32 h-32 md:w-40 md:h-40 bg-no-repeat bg-contain bg-center"
            style={{ backgroundImage: `url(${streetLt2})` }}
          ></div>

          {/* Mission Text */}
          <div className="text-white p-8 rounded-lg bg-gray-800 flex-1 text-lg leading-relaxed">
            LampPost is simple: Make the world a safer place. We strive to provide the most accurate and up-to-date
            crime information for citizens to utilize. No one else does it quite like us, as we provide you an
            interactive heat map of recent criminal activity.
          </div>

          {/* Right Logo */}
          <div
            className="w-32 h-32 md:w-40 md:h-40 bg-no-repeat bg-contain bg-center"
            style={{ backgroundImage: `url(${streetLt2})` }}
          ></div>
        </div>

        {/* Search Section */}
        <div className="w-full flex flex-col items-center gap-6">
          {/* Search Bar */}
          <div className="relative w-full max-w-lg">
            <SearchBar setResults={setResults} onSelect={handleResultClick} />
          </div>

          {/* Reserve space for Search Results */}
          <div className="w-full max-w-lg min-h-[150px] transition-all duration-300">
            {results.length > 0 && (
              <SearchResults results={results} onSelect={handleResultClick} />
            )}
          </div>

          

          {/* About Us Carousel */}
          <Carousel />
        </div>
      </div>
    </div>
  );
};

export default Home;
