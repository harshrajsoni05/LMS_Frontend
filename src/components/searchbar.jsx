
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



export default SearchBar;



