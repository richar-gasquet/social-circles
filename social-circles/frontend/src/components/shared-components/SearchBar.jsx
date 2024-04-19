import styles from "../../css/Search.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function SearchBar(props) {
  return (
    <div className={`row container-fluid input-group mb-2 ${styles.searchBar}`}>
      <button type="button" className={`btn ${styles.searchBtn}`}>
        <i className="fas fa-search"></i>
      </button>
      <input
        type="text"
        className={`form-control ${styles.searchInput}`}
        placeholder="Search for..."
        value={props.query}
        onChange={(e) => props.setQuery(e.target.value)}
      />
      <span className="sr-only">Search communities here</span>
    </div>
  );
}

export default SearchBar