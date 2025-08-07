function DramaList({ dramas, onDelete, onEdit }) {
  return (
    <div className="drama-grid">
      {dramas.map((drama) => (
        <div key={drama._id} className="drama-card">
          <img 
            src={`http://localhost:5000/${drama.coverImg}`} 
            alt={drama.name}
          />
          <h2>{drama.name}</h2>
          <p>⭐ {drama.rating}/10</p>
          <p>Genre: {drama.genre}</p>
          <p>Year: {drama.year}</p>
          <div className="drama-actions">
            <button className="edit-btn" title="Edit" onClick={() => onEdit(drama)}>&#9998;</button>
            <button className="delete-btn" title="Delete" onClick={() => onDelete(drama._id)}>&#128465;</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DramaList;
