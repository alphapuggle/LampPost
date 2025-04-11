import React from "react";
import "./SearchResultsList.css";

export const SearchResults = ({ results, onSelect }) => {
  if (results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div className="results-list">
      {results.map((result, id) => (
        <div
          key={id}
          className="result-item cursor-pointer hover:bg-gray-100 p-2"
          onClick={() => onSelect(result)}
        >
          <h3>{result.name}</h3>
        </div>
      ))}
    </div>
  );
};
