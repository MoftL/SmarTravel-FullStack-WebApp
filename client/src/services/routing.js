import { API_CONFIG } from '../constants';
import { formatDuration, formatDistance, getInstructionText, getDirectionIcon } from '../utils/formatters';
import { calculateStraightLineDistance } from '../utils/calculations';

// Function for getting real routes using OSRM
export const getRoutes = async (startCoords, endCoords) => {
  try {
    // Get multiple alternative routes
    const response = await fetch(
      `${API_CONFIG.OSRM_BASE_URL}/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=full&geometries=geojson&alternatives=true&steps=true&annotations=true`
    );

    if (!response.ok) {
      throw new Error('Error getting routes from OSRM');
    }

    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No routes found');
    }

    // Process all available routes
    const routes = data.routes.map((route, index) => {
      const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
      const distance = (route.distance / 1000).toFixed(1);
      const duration = Math.round(route.duration / 60);
      
      // Process detailed steps for directions
      const steps = route.legs[0].steps.map((step, stepIndex) => {
        const stepCoordinates = step.geometry && step.geometry.coordinates
          ? step.geometry.coordinates.map(coord => [coord[1], coord[0]])
          : [];
        const roadName = step.name || 'Unnamed road';
        const instruction = getInstructionText(step.maneuver, roadName);
        const icon = getDirectionIcon(step.maneuver);
        const distance = step.distance;
        const duration = step.duration;

        return {
          id: stepIndex,
          instruction,
          icon,
          distance: formatDistance(distance),
          duration: formatDuration(Math.round(duration / 60)),
          roadName,
          maneuver: step.maneuver,
          coordinates: stepCoordinates,
          rawDistance: distance,
          isCompleted: false
        };
      });

      return {
        id: index,
        coordinates,
        distance: parseFloat(distance),
        duration: formatDuration(duration),
        name: index === 0 ? 'Optimal Route' : `Alternative Route ${index}`,
        isSelected: index === 0,
        isActive: false,
        steps
      };
    });

    return routes;

  } catch (error) {
    console.error('OSRM Error:', error);
    // Fallback: create a simple straight line route
    const straightDistance = calculateStraightLineDistance(startCoords.lat, startCoords.lon, endCoords.lat, endCoords.lon);
    return [{
      id: 0,
      coordinates: [[startCoords.lat, startCoords.lon], [endCoords.lat, endCoords.lon]],
      distance: parseFloat(straightDistance),
      duration: formatDuration(Math.round(straightDistance * 1.2)), // Rough estimate
      name: 'Direct Route (approximate)',
      isSelected: true,
      isActive: false,
      steps: [
        {
          id: 0,
          instruction: 'Head directly to your destination',
          icon: '🚗',
          distance: `${straightDistance} km`,
          duration: formatDuration(Math.round(straightDistance * 1.2)),
          roadName: 'Direct route',
          coordinates: [[startCoords.lat, startCoords.lon], [endCoords.lat, endCoords.lon]],
          isCompleted: false
        }
      ]
    }];
  }
};