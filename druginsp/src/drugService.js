// // API service for fetching drug data
// const API_BASE_URL = 'https://api.fda.gov/drug/label.json';

// export const fetchDrugs = async (query) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}?search=${query}&limit=10`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();
//     // Map the results to a simpler structure for our app
//     return data.results.map(drug => ({
//       id: drug.id,
//       name: drug.openfda?.brand_name?.[0] || 'Unknown',
//       genericName: drug.openfda?.generic_name?.[0] || 'Unknown'
//     }));
//   } catch (error) {
//     console.error('Error fetching drugs:', error);
//     throw error;
//   }
// };

// export const fetchDrugDetails = async (drugId) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}?search=id:${drugId}&limit=1`);
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();
//     if (data.results && data.results.length > 0) {
//       const drug = data.results[0];
//       return {
//         id: drug.id,
//         name: drug.openfda?.brand_name?.[0] || 'Unknown',
//         genericName: drug.openfda?.generic_name?.[0] || 'Unknown',
//         description: drug.description?.[0] || 'No description available',
//         warnings: drug.warnings?.[0] || 'No warnings available',
//         dosage: drug.dosage_and_administration?.[0] || 'No dosage information available',
//         purpose: drug.purpose?.[0] || 'No purpose information available'
//       };
//     } else {
//       throw new Error('Drug not found');
//     }
//   } catch (error) {
//     console.error('Error fetching drug details:', error);
//     throw error;
//   }
// };
// src/services/drugService.js

// API URLs
const OPENFDA_API_URL = 'https://api.fda.gov/drug/label.json';
const RXNORM_API_URL = 'https://rxnav.nlm.nih.gov/REST';
const DAILYMED_API_URL = 'https://dailymed.nlm.nih.gov/dailymed';

// Helper function to fetch data from an API
const fetchFromAPI = async (url, errorMessage) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`${errorMessage}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
};

// Function to fetch drugs from OpenFDA
const fetchDrugsFromOpenFDA = async (query) => {
  const encodedQuery = encodeURIComponent(query);
  const data = await fetchFromAPI(
    `${OPENFDA_API_URL}?search=${encodedQuery}&limit=10`,
    'OpenFDA API request failed'
  );
  
  if (!data.results || data.results.length === 0) {
    return [];
  }
  
  return data.results.map(drug => ({
    id: drug.id,
    name: drug.openfda?.brand_name?.[0] || 'Unknown',
    genericName: drug.openfda?.generic_name?.[0] || 'Unknown',
    source: 'openfda'
  }));
};

// Function to fetch drugs from RxNorm
const fetchDrugsFromRxNorm = async (query) => {
  const data = await fetchFromAPI(
    `${RXNORM_API_URL}/drugs.json?name=${query}`,
    'RxNorm API request failed'
  );
  
  if (!data.drugGroup || !data.drugGroup.conceptGroup) {
    return [];
  }
  
  const drugs = [];
  data.drugGroup.conceptGroup.forEach(group => {
    if (group.conceptProperties) {
      group.conceptProperties.forEach(prop => {
        if (prop.tty === 'SBD' || prop.tty === 'SCD') { // Brand names or clinical drugs
          drugs.push({
            id: prop.rxcui,
            name: prop.name,
            genericName: prop.synonym || 'Unknown',
            source: 'rxnorm'
          });
        }
      });
    }
  });
  
  return drugs.slice(0, 10); // Limit to 10 results
};

// Function to fetch drugs from DailyMed
const fetchDrugsFromDailyMed = async (query) => {
  const data = await fetchFromAPI(
    `${DAILYMED_API_URL}/spls/spls.json?query=${query}`,
    'DailyMed API request failed'
  );
  
  if (!data.data || !data.data.length) {
    return [];
  }
  
  return data.data.slice(0, 10).map(drug => ({
    id: drug.setid,
    name: drug.title,
    genericName: drug.generic_name || 'Unknown',
    source: 'dailymed'
  }));
};

// Function to fetch drug details from OpenFDA
const fetchDrugDetailsFromOpenFDA = async (drugId) => {
  const data = await fetchFromAPI(
    `${OPENFDA_API_URL}?search=id:${drugId}&limit=1`,
    'OpenFDA API request failed'
  );
  
  if (!data.results || data.results.length === 0) {
    throw new Error('Drug not found in OpenFDA');
  }
  
  const drug = data.results[0];
  
  return {
    id: drug.id,
    name: drug.openfda?.brand_name?.[0] || 'Unknown',
    genericName: drug.openfda?.generic_name?.[0] || 'Unknown',
    description: drug.description?.[0] || 'No description available',
    warnings: drug.warnings?.[0] || 'No warnings available',
    dosage: drug.dosage_and_administration?.[0] || 'No dosage information available',
    purpose: drug.purpose?.[0] || 'No purpose information available',
    source: 'openfda'
  };
};

// Function to fetch drug details from RxNorm
const fetchDrugDetailsFromRxNorm = async (drugId) => {
  const data = await fetchFromAPI(
    `${RXNORM_API_URL}/rxcui/${drugId}/allProperties.json`,
    'RxNorm API request failed'
  );
  
  if (!data.propConceptGroup || !data.propConceptGroup.propConcept) {
    throw new Error('Drug details not found in RxNorm');
  }
  
  const properties = data.propConceptGroup.propConcept;
  
  return {
    id: drugId,
    name: properties.find(p => p.propName === 'RxNorm Name')?.propValue || 'Unknown',
    genericName: properties.find(p => p.propName === 'Generic Name')?.propValue || 'Unknown',
    description: properties.find(p => p.propName === 'RxNorm Description')?.propValue || 'No description available',
    warnings: 'No warnings available from RxNorm',
    dosage: 'No dosage information available from RxNorm',
    purpose: 'No purpose information available from RxNorm',
    source: 'rxnorm'
  };
};

// Function to fetch drug details from DailyMed
const fetchDrugDetailsFromDailyMed = async (drugId) => {
  const data = await fetchFromAPI(
    `${DAILYMED_API_URL}/spls/spl/${drugId}.json`,
    'DailyMed API request failed'
  );
  
  if (!data.set || !data.set.spl) {
    throw new Error('Drug details not found in DailyMed');
  }
  
  const spl = data.set.spl;
  
  return {
    id: drugId,
    name: spl.title || 'Unknown',
    genericName: spl.generic_name || 'Unknown',
    description: spl.description || 'No description available',
    warnings: spl.warnings || 'No warnings available',
    dosage: spl.dosage_and_administration || 'No dosage information available',
    purpose: spl.purpose || 'No purpose information available',
    source: 'dailymed'
  };
};

// Main function to fetch drugs (tries all APIs)
export const fetchDrugs = async (query) => {
  const results = [];
  const errors = [];
  
  // Try OpenFDA
  try {
    const openFDAResults = await fetchDrugsFromOpenFDA(query);
    results.push(...openFDAResults);
  } catch (error) {
    errors.push(`OpenFDA: ${error.message}`);
  }
  
  // Try RxNorm
  try {
    const rxNormResults = await fetchDrugsFromRxNorm(query);
    results.push(...rxNormResults);
  } catch (error) {
    errors.push(`RxNorm: ${error.message}`);
  }
  
  // Try DailyMed
  try {
    const dailyMedResults = await fetchDrugsFromDailyMed(query);
    results.push(...dailyMedResults);
  } catch (error) {
    errors.push(`DailyMed: ${error.message}`);
  }
  
  if (results.length === 0) {
    throw new Error(`All APIs failed: ${errors.join(', ')}`);
  }
  
  // Remove duplicates based on name
  const uniqueResults = [];
  const seenNames = new Set();
  
  for (const drug of results) {
    if (!seenNames.has(drug.name.toLowerCase())) {
      seenNames.add(drug.name.toLowerCase());
      uniqueResults.push(drug);
    }
  }
  
  return uniqueResults.slice(0, 10); // Limit to 10 results
};

// Main function to fetch drug details (tries all APIs)
export const fetchDrugDetails = async (drugId, source) => {
  // Try the specified source first
  if (source === 'rxnorm') {
    try {
      return await fetchDrugDetailsFromRxNorm(drugId);
    } catch (error) {
      console.error('RxNorm failed, trying other APIs');
    }
  } else if (source === 'dailymed') {
    try {
      return await fetchDrugDetailsFromDailyMed(drugId);
    } catch (error) {
      console.error('DailyMed failed, trying other APIs');
    }
  }
  
  // Default to OpenFDA
  try {
    return await fetchDrugDetailsFromOpenFDA(drugId);
  } catch (error) {
    console.error('OpenFDA failed, trying other APIs');
  }
  
  // If OpenFDA fails, try RxNorm
  try {
    return await fetchDrugDetailsFromRxNorm(drugId);
  } catch (error) {
    console.error('RxNorm failed, trying DailyMed');
  }
  
  // If RxNorm fails, try DailyMed
  try {
    return await fetchDrugDetailsFromDailyMed(drugId);
  } catch (error) {
    throw new Error('All APIs failed to fetch drug details');
  }
};