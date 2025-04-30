import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { SearchResults } from "./SearchResultsList.jsx"; // Import here if not already

export const SearchBar = ({ setResults, onSelect }) => {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState(input);
  const [localResults, setLocalResults] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
    }, 500);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    if (debouncedInput.trim() === "") {
      setResults([]);
      setLocalResults([]);
    } else {
      fetchData(debouncedInput);
    }
  }, [debouncedInput]);

  const fetchData = (value) => {
    fetch("/SearchBar.json")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) =>
          user.name.toLowerCase().includes(value.toLowerCase())
        );
        setResults(results);
        setLocalResults(results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && localResults.length > 0) {
      onSelect(localResults[0]); // Select top result
    }
  };

  return (
    <div className="relative w-full">
      <div className="input-wrapper w-full">
        <FaSearch id="search-icon" />
        <input
          placeholder="Type to search..."
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full placeholder-white text-white"
        />

      </div>
      
    </div>
  );
  
  
  
};
