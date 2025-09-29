// Application constants
export const MAP_CONFIG = {
  DEFAULT_CENTER: [45.9432, 24.9668],
  DEFAULT_ZOOM: 7,
  TILE_LAYER_URL: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  ATTRIBUTION: '&copy; OpenStreetMap contributors'
};

export const API_CONFIG = {
  NOMINATIM_BASE_URL: 'https://nominatim.openstreetmap.org',
  OSRM_BASE_URL: 'https://router.project-osrm.org/route/v1/driving',
  SEARCH_LIMIT: 5,
  COUNTRY_CODES: 'ro,de'
};

export const FUEL_CONFIG = {
  DEFAULT_CONSUMPTION: '7.5',
  DEFAULT_PRICE: '6.8',
  MIN_CONSUMPTION: 1,
  MAX_CONSUMPTION: 50,
  MIN_PRICE: 0.1,
  MAX_PRICE: 20
};

export const UI_CONFIG = {
  SEARCH_PANEL_WIDTH: '300px',
  DIRECTIONS_PANEL_WIDTH: '350px',
  DIRECTIONS_PANEL_MAX_HEIGHT: '400px',
  SUGGESTION_MIN_LENGTH: 3,
  ERROR_TIMEOUT: 3000,
  SUCCESS_TIMEOUT: 5000
};

export const ROUTE_COLORS = {
  ACTIVE: '#28a745',
  SELECTED: '#1e3a8a',
  ALTERNATIVE: '#3b82f6'
};

export const ROUTE_WEIGHTS = {
  ACTIVE: 8,
  SELECTED: 6,
  ALTERNATIVE: 4
};