import L from 'leaflet';

// Create icon for starting point
export const startIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/7987/7987463.png',
  iconSize: [28, 28],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Create icon for destination
export const destinationIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Create route info marker
export const createRouteInfoIcon = (route, distance, duration) => {
  return L.divIcon({
    className: 'route-info-marker',
    html: `<div style="
      background: ${route.isActive ? '#28a745' : (route.isSelected ? '#1e3a8a' : '#3b82f6')};
      color: white;
      padding: 4px 6px;
      padding-top: 6px;
      border-radius: 12px;
      width: 100px;
      text-align: center;
      font-size: 11px;
      font-weight: bold;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      cursor: pointer;
      white-space: nowrap;
    ">${distance}km • ${duration}</div>`,
    iconSize: [90, 24],
    iconAnchor: [45, 12]
  });
};