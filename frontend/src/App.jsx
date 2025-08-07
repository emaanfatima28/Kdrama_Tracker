import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DramaForm from './components/DramaForm';
import DramaList from './components/DramaList';
import Filters from './components/Filters';

function App() {
  const [dramas, setDramas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editDrama, setEditDrama] = useState(null);
  const [filteredDramas, setFilteredDramas] = useState([]);
  const [years, setYears] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get("http://localhost:5000/api/dramas")
      .then((res) => {
        setDramas(res.data);
        setFilteredDramas(res.data);
        const uniqueYears = [...new Set(res.data.map(d => d.year))].sort((a,b) => b-a);
        const uniqueGenres = [...new Set(res.data.map(d => d.genre))].sort();
        setYears(uniqueYears);
        setGenres(uniqueGenres);
      })
      .catch(() => alert("Failed to load dramas"));
  }, []);
  
  useEffect(() => {
    let result = dramas;
    if (selectedYear) {
      result = result.filter(d => d.year === parseInt(selectedYear));
    }
    if (selectedGenre) {
      result = result.filter(d => d.genre === selectedGenre);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(s) ||
        d.genre.toLowerCase().includes(s) ||
        String(d.year).includes(s)
      );
    }
    setFilteredDramas(result);
  }, [selectedYear, selectedGenre, dramas, search]);

  const addDrama = (newDrama) => {
    const updatedDramas = [newDrama, ...dramas];
    setDramas(updatedDramas);
    setShowForm(false);
    setEditDrama(null);
    if (!years.includes(newDrama.year)) {
      setYears([...years, newDrama.year].sort((a,b) => b-a));
    }
    if (!genres.includes(newDrama.genre)) {
      setGenres([...genres, newDrama.genre].sort());
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this drama?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/dramas/${id}`);
      setDramas(dramas.filter(d => d._id !== id));
    } catch (err) {
      alert('Failed to delete drama');
    }
  };

  const handleEdit = (drama) => {
    setEditDrama(drama);
    setShowForm(true);
  };

  const handleUpdateDrama = async (updatedDrama, file) => {
    try {
      const formData = new FormData();
      formData.append('name', updatedDrama.name);
      formData.append('rating', updatedDrama.rating);
      formData.append('genre', updatedDrama.genre);
      formData.append('year', updatedDrama.year);
      if (file) {
        formData.append('coverImg', file);
      }
      const res = await axios.put(`http://localhost:5000/api/dramas/${updatedDrama._id}`, formData);
      setDramas(dramas.map(d => d._id === updatedDrama._id ? res.data : d));
      setShowForm(false);
      setEditDrama(null);
    } catch (err) {
      alert('Failed to update drama');
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 style={{fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>🎬 K-Drama Tracker</h1>
        <button 
          onClick={() => { setShowForm(true); setEditDrama(null); }}
          className="add-drama-btn">
          ➕ Add Drama
        </button>
      </header>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search dramas by name, genre, or year..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="content-area">
        <Filters 
          years={years} 
          genres={genres} 
          onYearChange={setSelectedYear} 
          onGenreChange={setSelectedGenre}
        />
        <main className="main-content">
          <DramaList dramas={filteredDramas} onDelete={handleDelete} onEdit={handleEdit} />
        </main>
      </div>

      {/* Modal for DramaForm */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button 
              onClick={() => { setShowForm(false); setEditDrama(null); }} 
              className="close-modal-btn">&times;</button>
            <DramaForm onAdd={addDrama} editDrama={editDrama} onUpdate={handleUpdateDrama} availableGenres={genres} availableYears={years} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
