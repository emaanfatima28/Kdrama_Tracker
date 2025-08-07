function Filters({ years, genres, onYearChange, onGenreChange }) {
  return (
    <div className="filters-container">
      <h3>Filters</h3>
      
      <div className="filter-group">
        <label htmlFor="year-filter">Filter by Year</label>
        <select id="year-filter" onChange={(e) => onYearChange(e.target.value)}>
          <option value="">All Years</option>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="genre-filter">Filter by Genre</label>
        <select id="genre-filter" onChange={(e) => onGenreChange(e.target.value)}>
          <option value="">All Genres</option>
          {genres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
        </select>
      </div>
    </div>
  );
}

export default Filters; 