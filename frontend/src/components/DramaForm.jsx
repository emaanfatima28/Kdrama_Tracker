import { useState, useEffect } from 'react';
import axios from 'axios';

function DramaForm({ onAdd, editDrama, onUpdate, availableGenres = [], availableYears = [] }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [coverImg, setCoverImg] = useState(null);

  const [customYear, setCustomYear] = useState('');
  const [customGenre, setCustomGenre] = useState('');
  const [useCustomGenre, setUseCustomGenre] = useState(false);

  const defaultGenres = ['Romance', 'Comedy', 'Drama', 'Thriller', 'Action', 'Mystery', 'Historical', 'Fantasy', 'Slice of Life', 'Medical', 'Legal', 'School', 'Family', 'Horror', 'Sci-Fi'];

  useEffect(() => {
    if (editDrama) {
      setName(editDrama.name || '');
      setRating(editDrama.rating || '');
      setGenre(editDrama.genre || '');
      setYear(editDrama.year || '');
      setCoverImg(null);
      setCustomYear('');
      setCustomGenre('');
      setUseCustomGenre(false);
    } else {
      setName('');
      setRating('');
      setGenre('');
      setYear('');
      setCoverImg(null);

      setCustomYear('');
      setCustomGenre('');
      setUseCustomGenre(false);
    }
  }, [editDrama]);

  const handleGenreChange = (val) => {
    setGenre(val);
    if (val === 'other') {
      setUseCustomGenre(true);
    } else {
      setUseCustomGenre(false);
      setCustomGenre('');
    }
  };
  const handleYearChange = (val) => {
    setYear(val);
    if (val !== 'other') setCustomYear('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editDrama && !coverImg) return alert("Please select a cover image!");
    const finalGenre = useCustomGenre ? customGenre : genre;
    const finalYear = year === 'other' ? customYear : year;
    if (!finalGenre || !finalYear) return alert('Please enter a genre and year');

    if (editDrama) {
      onUpdate({
        ...editDrama,
        name,
        rating,
        genre: finalGenre,
        year: finalYear,
      }, coverImg);
    } else {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("rating", rating);
      formData.append("genre", finalGenre);
      formData.append("year", finalYear);
      formData.append("coverImg", coverImg);

      try {
        const res = await axios.post("http://localhost:5000/api/dramas", formData);
        onAdd(res.data);
        setName('');
        setRating('');
        setGenre('');
        setYear('');
        setCoverImg(null);
        setCustomYear('');
        setCustomGenre('');
        setUseCustomGenre(false);
      } catch (err) {
        alert("Error uploading drama");
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="drama-form">
      <h2 style={{fontFamily: 'Poppins', fontSize: '1.2rem', fontWeight: '600'}}>{editDrama ? 'Edit Drama' : 'Add New Drama'}</h2>
      <input
        type="text"
        placeholder="Drama name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Rating (out of 10)"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
      />
      {/* Genre dropdown with fallback */}
      <select value={genre} onChange={e => handleGenreChange(e.target.value)} required>
        <option value="" disabled>Select Genre</option>
        {(availableGenres.length > 0 ? availableGenres : defaultGenres).map(g => (
          <option key={g} value={g}>{g}</option>
        ))}
        <option value="other">Other (type below)</option>
      </select>
      {/* Show text input if 'Other' selected */}
      {useCustomGenre && (
        <input
          type="text"
          placeholder="Enter custom genre"
          value={customGenre}
          onChange={e => setCustomGenre(e.target.value)}
          required
        />
      )}
      {/* Year dropdown or input */}
      {availableYears.length > 0 ? (
        <select value={year} onChange={e => handleYearChange(e.target.value)} required>
          <option value="" disabled>Select Year</option>
          {availableYears.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
          <option value="other">Other (type below)</option>
        </select>
      ) : null}
      {}
      {(availableYears.length === 0 || year === 'other') && (
        <input
          type="number"
          placeholder="Year"
          value={year === 'other' ? customYear : year}
          onChange={e => year === 'other' ? setCustomYear(e.target.value) : setYear(e.target.value)}
          required
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCoverImg(e.target.files[0])}
        required={!editDrama}
      />
      <button 
        type="submit">
        {editDrama ? '✏️ Update Drama' : '📥 Add Drama'}
      </button>
    </form>
  );
}

export default DramaForm;
