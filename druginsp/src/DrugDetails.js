// import React from 'react';

// const DrugDetails = ({ drug }) => {
//   return (
//     <div className="drug-details">
//       <h2>{drug.name}</h2>
//       <h3>Generic Name: {drug.genericName}</h3>
      
//       <div className="detail-section">
//         <h4>Description</h4>
//         <p>{drug.description}</p>
//       </div>
      
//       <div className="detail-section">
//         <h4>Purpose</h4>
//         <p>{drug.purpose}</p>
//       </div>
      
//       <div className="detail-section">
//         <h4>Dosage and Administration</h4>
//         <p>{drug.dosage}</p>
//       </div>
      
//       <div className="detail-section">
//         <h4>Warnings</h4>
//         <p>{drug.warnings}</p>
//       </div>
//     </div>
//   );
// };

// export default DrugDetails;
// src/components/DrugDetails.js
import React from 'react';

const DrugDetails = ({ drug }) => {
  // Get the source name for display
  const getSourceName = (source) => {
    switch (source) {
      case 'openfda': return 'OpenFDA';
      case 'rxnorm': return 'RxNorm';
      case 'dailymed': return 'DailyMed';
      default: return 'Unknown';
    }
  };

  return (
    <div className="drug-details">
      <h2>{drug.name}</h2>
      <h3>Generic Name: {drug.genericName}</h3>
      <p className="info-source">Source: {getSourceName(drug.source)}</p>
      
      <div className="detail-section">
        <h4>Description</h4>
        <p>{drug.description}</p>
      </div>
      
      <div className="detail-section">
        <h4>Purpose</h4>
        <p>{drug.purpose}</p>
      </div>
      
      <div className="detail-section">
        <h4>Dosage and Administration</h4>
        <p>{drug.dosage}</p>
      </div>
      
      <div className="detail-section">
        <h4>Warnings</h4>
        <p>{drug.warnings}</p>
      </div>
    </div>
  );
};

export default DrugDetails;