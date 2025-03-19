import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

export const SearchBar = () => {
    const [input, setInput] = useState("");

    const fetchData = (value) => {
        fetch("./SearchBar.json") // Fixed typo: SeachBar -> SearchBar
            .then((response) => response.json())
            .then((json) => {
                console.log(json); // Handle the fetched data
            })
            .catch((error) => {
                console.error("Error fetching data:", error); // Handle fetch errors
            });
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setInput(value);
        fetchData(value);
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