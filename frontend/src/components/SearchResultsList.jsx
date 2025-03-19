import React from "react";
import "./SearchResultsList.css";

export const SearchResults = ({ results }) => {
  if (results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div className="results-list">
      {results.map((result, id) => {
        return (
          <div key={id} className="result-item">
            <h3>{result.name}</h3>
            {/* Display other fields if necessary */}
            <p>{result.description}</p>
          </div>
        );
      })}
    </div>
  );
};