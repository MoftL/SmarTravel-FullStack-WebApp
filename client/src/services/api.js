const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Base fetch function with auth headers
const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  
  return response.json();
};

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await fetchWithAuth(`${API_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await fetchWithAuth(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  },

  // Logout user
  logout: () => {
    removeToken();
    return Promise.resolve();
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!getToken();
  },
};

// Trip API functions
export const tripAPI = {
  // Create new trip
  create: async (tripData) => {
    return await fetchWithAuth(`${API_URL}/trips`, {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  },

  // Get user's trips
  getMyTrips: async () => {
    return await fetchWithAuth(`${API_URL}/trips/my-trips`);
  },

  // Get specific trip
  getById: async (tripId) => {
    return await fetchWithAuth(`${API_URL}/trips/${tripId}`);
  },

  // Start trip
  start: async (tripId) => {
    return await fetchWithAuth(`${API_URL}/trips/${tripId}/start`, {
      method: 'PUT',
    });
  },

  // Complete trip
  complete: async (tripId) => {
    return await fetchWithAuth(`${API_URL}/trips/${tripId}/complete`, {
      method: 'PUT',
    });
  },

  // Delete trip
  delete: async (tripId) => {
    return await fetchWithAuth(`${API_URL}/trips/${tripId}`, {
      method: 'DELETE',
    });
  },
};