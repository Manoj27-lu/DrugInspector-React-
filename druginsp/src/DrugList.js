const DrugList = ({ drugs, onDrugSelect, selectedDrugId, hasSearched }) => {
  if (!hasSearched) {
    return <div className="no-results">Enter a search term to find drugs</div>;
  }
  
  if (drugs.length === 0) {
    return <div className="no-results">No drugs found. Try another search.</div>;
  }

  return (
    <div className="drug-list">
      <h2>Search Results</h2>
      <ul>
        {drugs.map(drug => (
          <li 
            key={drug.id} 
            className={`drug-item ${drug.id === selectedDrugId ? 'selected' : ''}`}
            onClick={() => onDrugSelect(drug)}
          >
            <div className="drug-name">{drug.name}</div>
            <div className="drug-generic">{drug.genericName}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DrugList;