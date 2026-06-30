import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { useApp } from '../context/AppContext';

const SearchBar = ({ placeholder = 'Search files, folders...' }) => {
  const { searchQuery, setSearchQuery } = useApp();

  return (
    <div className="search-container">
      <FiSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
