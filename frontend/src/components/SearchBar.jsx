import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = ({ setResults }) => {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState(input);

  // Set debounce delay to 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
    }, 500); // Adjust debounce delay as needed

    return () => clearTimeout(timer); // Cleanup timer on input change
  }, [input]);

  // Fetch data when debounced input changes
  useEffect(() => {
    if (debouncedInput.trim() === "") {
      setResults([]); // Clear results when input is empty
    } else {
      fetchData(debouncedInput);
    }
  }, [debouncedInput]);

  const fetchData = (value) => {
    fetch("/SearchBar.json")
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) =>
          user.name.toLowerCase().includes(value.toLowerCase()) // Case-insensitive search
        );
        setResults(results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div className="input-wrapper w-1/2">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to search..."
        type="text"
        value={input}
        onChange={handleChange}
      />
    </div>
  );
};
