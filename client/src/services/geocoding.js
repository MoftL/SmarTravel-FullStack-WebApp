import { API_CONFIG } from '../constants';

// Function for searching location suggestions
export const searchSuggestions = async (query) => {
  if (query.length < 3) return [];
  
  try {
    const response = await fetch(
      `${API_CONFIG.NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=${API_CONFIG.SEARCH_LIMIT}&countrycodes=${API_CONFIG.COUNTRY_CODES}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

// Function for getting coordinates based on address
export const getCoordinates = async (address) => {
  try {
    const response = await fetch(
      `${API_CONFIG.NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(address)}&limit=1`
    );

    if (!response.ok) {
      throw new Error('Error getting coordinates');
    }

    const data = await response.json();
    if (data.length === 0) {
      throw new Error('No coordinates found for address: ' + address);
    }
    
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      display_name: data[0].display_name
    };
  } catch (error) {
    throw error;
  }
};