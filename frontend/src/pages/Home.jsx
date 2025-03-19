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
      <div className="flex flex-col items-center min-h-screen w-full backdrop-blur-md pb-12">
        
        {/* Header */}
        <div className="relative text-white p-6 text-center">
          <h1 className="text-3xl">Welcome to LampPost</h1>
          <p className="m-1.5">Shine some light on your local crime!</p>
          <p className="text-4xl tracking-widest m-3.5 bg-gradient-to-r from-[#C62C2C] to-[#FF8C01] p-1 rounded-lg">
            Our Mission:
          </p>
        </div>

        {/* Mission Statement and Logos */}
        <div className="relative w-3/5 mx-auto flex flex-col md:flex-row items-center justify-between text-center gap-6">
          
          <div
            className="mb-4 flex-none w-32 h-32 md:w-40 md:h-40 bg-no-repeat bg-contain bg-center"
            style={{ backgroundImage: `url(${streetLt2})` }}
          ></div>

          <div className="text-white p-10 rounded-lg bg-gray-800 flex-1">
            LampPost is simple: Make the world a safer place.
             We strive to provide the most accurate and up-to-date
              crime information for citizens to utilize. No one else
               does it quite like us, as we provide you an interactive
                heat map of recent criminal activity.
          </div>

          <div
            className="flex-none w-32 h-32 md:w-40 md:h-40 bg-no-repeat bg-contain bg-center"
            style={{ backgroundImage: `url(${streetLt2})` }}
          ></div>

        </div>

        {/* Search Section */}
        <div className="w-full flex flex-col items-center mt-[20vh]">
          
          {/* Search Bar positioned in the lower 2/3rds of the page */}
          <div className="w-full max-w-lg">
            <SearchBar setResults={setResults} />
          </div>

          {/* Search Results appear 1/10th below the search bar */}
          {results.length > 0 && (
            <div className="w-full max-w-lg mt-8"> {/* mt-8 ensures spacing */}
              <SearchResults results={results} />
            </div>
          )}

        </div>
        
      </div>
    </div>
  );
};

export default Home;
