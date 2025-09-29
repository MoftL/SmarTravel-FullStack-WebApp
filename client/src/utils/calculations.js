// Function for calculating straight line distance
export const calculateStraightLineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

// Function for calculating fuel cost
export const calculateFuelCost = (distance, consumption, price) => {
  const litersNeeded = (distance * consumption) / 100;
  const cost = litersNeeded * price;
  return cost.toFixed(2);
};

// Function to center map on route - ENHANCED with better zoom calculation
export const centerMapOnRoute = (route, mapRef) => {
  if (!route.coordinates || route.coordinates.length === 0 || !mapRef.current) return;
  
  // Calculate bounds of the route
  let minLat = route.coordinates[0][0];
  let maxLat = route.coordinates[0][0];
  let minLon = route.coordinates[0][1];
  let maxLon = route.coordinates[0][1];
  
  route.coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord[0]);
    maxLat = Math.max(maxLat, coord[0]);
    minLon = Math.min(minLon, coord[1]);
    maxLon = Math.max(maxLon, coord[1]);
  });
  
  // Calculate center point
  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;
  
  // Calculate appropriate zoom level based on distance - ENHANCED FOR CLOSER VIEW
  const latDiff = maxLat - minLat;
  const lonDiff = maxLon - minLon;
  const maxDiff = Math.max(latDiff, lonDiff);
  
  let zoom = 12;
  if (maxDiff < 0.005) zoom = 17;      // Very short routes - much closer
  else if (maxDiff < 0.01) zoom = 15;  // Short routes - closer
  else if (maxDiff < 0.05) zoom = 13;  // Medium-short routes
  else if (maxDiff < 0.1) zoom = 12;   // Medium routes
  else if (maxDiff < 0.5) zoom = 10;    // Long routes
  else if (maxDiff < 1) zoom = 9;      // Very long routes
  else zoom = 8;                       // Extremely long routes
  
  mapRef.current.setView([centerLat, centerLon], zoom);
};