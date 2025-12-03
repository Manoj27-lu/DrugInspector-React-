// // src/drugapp.js
// import React, { useState } from 'react';
// import './App.css';
// import DrugSearch from './DrugSearch';
// import DrugDetails from './DrugDetails';
// import DrugList from './DrugList';
// import { fetchDrugs, fetchDrugDetails } from './drugService';

// function DrugApp() {  // Changed to PascalCase
//   const [drugs, setDrugs] = useState([]);
//   const [selectedDrug, setSelectedDrug] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [hasSearched, setHasSearched] = useState(false); // Added search state

//   const handleSearch = async (query) => {
//     if (!query.trim()) return; // Prevent empty searches

//     setLoading(true);
//     setError(null);
//     setHasSearched(true);

//     try {
//       const results = await fetchDrugs(query);
//       setDrugs(results);

//       if (results.length > 0) {
//         const details = await fetchDrugDetails(results[0].id);
//         setSelectedDrug(details);
//       } else {
//         setSelectedDrug(null);
//       }
//     } catch (err) {
//       setError('Failed to fetch drug information. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDrugSelect = async (drug) => {
//     if (selectedDrug?.id === drug.id) return; // Prevent re-fetching same drug

//     setLoading(true);
//     try {
//       const details = await fetchDrugDetails(drug.id);
//       setSelectedDrug(details);
//     } catch (err) {
//       setError('Failed to fetch drug details. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app">
//       <header className="app-header">
//         <h1>Drug Instructor</h1>
//         <p>Comprehensive drug information at your fingertips</p>
//       </header>

//       <div className="search-container">
//         <DrugSearch onSearch={handleSearch} />
//       </div>

//       <div className="app-content">
//         {loading && <div className="loading">Loading drug information...</div>}
//         {error && <div className="error">{error}</div>}

//         <div className="results-container">
//           <div className="drug-list-container">
//             <DrugList
//               drugs={drugs}
//               onDrugSelect={handleDrugSelect}
//               selectedDrugId={selectedDrug?.id}
//               hasSearched={hasSearched} // Added prop
//             />
//           </div>

//           <div className="drug-details-container">
//             {selectedDrug ? (
//               <DrugDetails drug={selectedDrug} />
//             ) : (
//               <div className="placeholder">
//                 <div className="placeholder-icon">
//                   {/* Replaced Font Awesome with SVG */}
//                   <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M10.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10.5"></path>
//                     <line x1="12" y1="15" x2="12" y2="19"></line>
//                     <line x1="8" y1="19" x2="16" y2="19"></line>
//                     <circle cx="17.5" cy="17.5" r="2.5"></circle>
//                     <path d="M19 16l-1.5 1.5"></path>
//                   </svg>
//                 </div>
//                 <h3>{hasSearched ? "No Drug Selected" : "Search for a Drug"}</h3>
//                 <p>{hasSearched
//                   ? "Select a drug from the list to view details"
//                   : "Enter a drug name in the search bar to view detailed information"}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <footer className="app-footer">
//         <p>© 2023 Drug Instructor | Information provided by OpenFDA API</p>
//       </footer>
//     </div>
//   );
// }

// export default DrugApp; // Changed to PascalCase// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import DrugSearch from './DrugSearch';
import DrugDetails from './DrugDetails';
import DrugList from './DrugList';
import { fetchDrugs, fetchDrugDetails } from './drugService';

function DrugApp() {
  const [drugs, setDrugs] = useState([]);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const results = await fetchDrugs(query);
      setDrugs(results);
      
      if (results.length > 0) {
        const details = await fetchDrugDetails(results[0].id);
        setSelectedDrug(details);
      } else {
        setSelectedDrug(null);
      }
    } catch (err) {
      setError('Failed to fetch drug information. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrugSelect = async (drug) => {
    if (selectedDrug?.id === drug.id) return;
    
    setLoading(true);
    try {
      const details = await fetchDrugDetails(drug.id);
      setSelectedDrug(details);
    } catch (err) {
      setError('Failed to fetch drug details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Drug Instructor</h1>
        <p>Comprehensive drug information at your fingertips</p>
      </header>

      <div className="search-container">
        <DrugSearch onSearch={handleSearch} />
      </div>

      <div className="app-content">
        {loading && <div className="loading">Loading drug information...</div>}
        {error && <div className="error">{error}</div>}
        
        <div className="results-container">
          <div className="drug-list-container">
            <DrugList 
              drugs={drugs} 
              onDrugSelect={handleDrugSelect} 
              selectedDrugId={selectedDrug?.id} 
              hasSearched={hasSearched} 
            />
          </div>
          
          <div className="drug-details-container">
            {selectedDrug ? (
              <DrugDetails drug={selectedDrug} />
            ) : (
              <div className="placeholder">
                <div className="placeholder-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10.5"></path>
                    <line x1="12" y1="15" x2="12" y2="19"></line>
                    <line x1="8" y1="19" x2="16" y2="19"></line>
                    <circle cx="17.5" cy="17.5" r="2.5"></circle>
                    <path d="M19 16l-1.5 1.5"></path>
                  </svg>
                </div>
                <h3>{hasSearched ? "No Drug Selected" : "Search for a Drug"}</h3>
                <p>{hasSearched 
                  ? "Select a drug from the list to view details" 
                  : "Enter a drug name in the search bar to view detailed information"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="app-footer">
        <p>© Manoj's Drug Instructor </p>
      </footer>
    </div>
  );
}

export default DrugApp;