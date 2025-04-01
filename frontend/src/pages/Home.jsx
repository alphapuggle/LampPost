import { useState } from "react";
import darkAlley from "../assets/darkAlley.jpg";
import streetLt2 from "../assets/streetlight2.png";
import { SearchBar } from "../components/SearchBar";
import { SearchResults } from "../components/SearchResultsList";

const Home = () => {
  const [results, setResults] = useState([]);

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: `url(${darkAlley})`, backgroundAttachment: "scroll" }}
    >
      {/* Full-page Blur Overlay */}
      <div className="absolute inset-0 backdrop-blur-lg"></div>

      {/* Centered Main Content */}
      <div className="relative flex flex-col items-center w-full min-h-screen pb-12 pt-[15%] gap-8 z-10">
        
        {/* Header */}
        <div className="text-white text-center">
          <h1 className="text-3xl">Welcome to LampPost</h1>
          <p className="mt-2 text-lg">Shine some light on your local crime!</p>
        </div>

        {/* Our Mission - Reduced Gap */}
        <div className="text-4xl tracking-widest bg-gradient-to-r from-[#C62C2C] to-[#FF8C01] p-1 rounded-lg text-center">
          Our Mission:
        </div>

        {/* Mission Statement and Logos - Pulled Closer */}
        <div className="w-3/5 mx-auto flex flex-col md:flex-row items-center justify-between text-center gap-4 -mt-2">
          
          {/* Left Logo */}
          <div
            className="w-32 h-32 md:w-40 md:h-40 bg-no-repeat bg-contain bg-center"
            style={{ backgroundImage: `url(${streetLt2})` }}
          ></div>

          {/* Mission Description */}
          <div className="text-white p-8 rounded-lg bg-gray-800 flex-1 text-lg leading-relaxed">
            LampPost is simple: Make the world a safer place.
            We strive to provide the most accurate and up-to-date
            crime information for citizens to utilize. No one else
            does it quite like us, as we provide you an interactive
            heat map of recent criminal activity.
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
          <div className="w-full max-w-lg">
            <SearchBar setResults={setResults} />
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="w-full max-w-lg">
              <SearchResults results={results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
