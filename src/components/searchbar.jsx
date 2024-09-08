import PropTypes from 'prop-types';

import search from '../assets/images/search.png';
import '../styles/SearchBar.css'


const SearchBar = ({ searchTerm, onChange, onSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        value={searchTerm}
        onChange={onChange}
        placeholder="Search..."
      />
      <button className="search-button" onClick={onSearch}>
        <img src={search} alt="Search" className="search-icon" />
      </button>
    </div>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func, // Optional: If you want to handle the search button click
};

export default SearchBar;



