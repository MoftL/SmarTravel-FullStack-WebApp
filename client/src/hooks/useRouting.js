// import { useState } from 'react';
// import { getCoordinates } from '../services/geocoding';
// import { getRoutes } from '../services/routing';
// import { centerMapOnRoute } from '../utils/calculations';

// export const useRouting = () => {
//   // State for coordinates and search status
//   const [startCoords, setStartCoords] = useState(null);
//   const [destinationCoords, setDestinationCoords] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // State for routes and their management
//   const [availableRoutes, setAvailableRoutes] = useState([]);
//   const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
//   const [activeRoute, setActiveRoute] = useState(null);

//   // Function for searching routes based on user input
//   const handleSearchRoute = async (startPoint, destination, mapRef, updateFuelCost, setError) => {
//     if (startPoint.trim() === '' || destination.trim() === '') {
//       setError('Please fill in both fields!');
//       return null; // Return null if validation fails
//     }

//     setIsLoading(true);
//     setError('');
//     setActiveRoute(null);

//     try {
//       const startResult = await getCoordinates(startPoint);
//       const destinationResult = await getCoordinates(destination);

//       setStartCoords(startResult);
//       setDestinationCoords(destinationResult);

//       const routes = await getRoutes(startResult, destinationResult);
//       setAvailableRoutes(routes);
//       setSelectedRouteIndex(0);

//       if (routes.length > 0) {
//         const selectedRoute = routes[0];
//         updateFuelCost(selectedRoute.distance, null, null);
        
//         // Center map on the first route
//         centerMapOnRoute(selectedRoute, mapRef);

//         // IMPORTANT: Return the route data so App.js can use it
//         return {
//           distance: selectedRoute.distance,
//           duration: Math.round(selectedRoute.duration), // Convert to minutes if it's a string
//           coordinates: selectedRoute.coordinates
//         };
//       }

//       return null; // No routes found

//     } catch (error) {
//       setError(error.message);
//       return null; // Return null on error
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Function for selecting a route from the map - MODIFIED: NO AUTO-CENTERING
//   const handleRouteClick = (routeIndex, updateFuelCost) => {
//     const updatedRoutes = availableRoutes.map((route, index) => ({
//       ...route,
//       isSelected: index === routeIndex,
//       isActive: false
//     }));
    
//     setAvailableRoutes(updatedRoutes);
//     setSelectedRouteIndex(routeIndex);
//     setActiveRoute(null);

//     const selectedRoute = updatedRoutes[routeIndex];
//     updateFuelCost(selectedRoute.distance);
//   };

//   // Function for activating selected route
//   const handleStartRoute = (setDirections, setShowDirections, setCurrentStepIndex, setTripStartTime, setTripEndTime, fuelCost, setError) => {
//     if (availableRoutes.length > 0) {
//       const updatedRoutes = availableRoutes.map((route, idx) => ({
//         ...route,
//         isActive: idx === selectedRouteIndex,
//         isSelected: false,
//         name: idx === selectedRouteIndex ? 'Active Route' : route.name
//       }));

//       setAvailableRoutes(updatedRoutes);
//       const activeRoute = updatedRoutes[selectedRouteIndex];
//       setActiveRoute(activeRoute);
//       setDirections(activeRoute.steps || []);
//       setShowDirections(true);
//       setCurrentStepIndex(0);
//       setTripStartTime(new Date());
//       setTripEndTime(null);

//       setError(`Route activated: ${activeRoute.distance} km - Fuel cost: ${fuelCost} RON`);
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // Function for canceling active route
//   const handleCancelRoute = (clearSearch, setShowDirections, setDirections, setCurrentStepIndex, setTripStartTime, setTripEndTime, setIsCompletingTrip, setFuelCost, setError) => {
//     setAvailableRoutes([]);
//     setActiveRoute(null);
//     setSelectedRouteIndex(0);
//     setStartCoords(null);
//     setDestinationCoords(null);
//     clearSearch();
//     setFuelCost(0);
//     setError('');
//     setShowDirections(false);
//     setDirections([]);
//     setCurrentStepIndex(0);
//     setTripStartTime(null);
//     setTripEndTime(null);
//     setIsCompletingTrip(false);
//   };

//   return {
//     startCoords,
//     destinationCoords,
//     isLoading,
//     availableRoutes,
//     selectedRouteIndex,
//     activeRoute,
//     setSelectedRouteIndex,
//     handleSearchRoute,
//     handleRouteClick,
//     handleStartRoute,
//     handleCancelRoute
//   };
// };

import { useState } from 'react';
import { getCoordinates } from '../services/geocoding';
import { centerMapOnRoute } from '../utils/calculations';

export const useRouting = () => {
  // State for coordinates and search status
  const [startCoords, setStartCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for routes and their management
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [activeRoute, setActiveRoute] = useState(null);

  // Helper functions for route instructions
  const getInstructionText = (maneuver, roadName) => {
    const type = maneuver.type;
    const modifier = maneuver.modifier;

    switch(type) {
      case 'depart':
        return `Start your journey heading ${modifier || 'forward'} on ${roadName || 'the road'}.`;
      case 'turn':
        if (modifier === "left") return `Turn left onto ${roadName || 'the road'}.`;
        if (modifier === "right") return `Turn right onto ${roadName || 'the road'}.`;
        if (modifier === "sharp left") return `Make a sharp left onto ${roadName || 'the road'}.`;
        if (modifier === "sharp right") return `Make a sharp right onto ${roadName || 'the road'}.`;
        if (modifier === "slight left") return `Slight left onto ${roadName || 'the road'}.`;
        if (modifier === "slight right") return `Slight right onto ${roadName || 'the road'}.`;
        return `Turn onto ${roadName || 'the road'}.`;
      case 'merge':
        return `Merge ${modifier || ''} onto ${roadName || 'the highway'}`;
      case 'roundabout':
        const exit = maneuver.exit || 1;
        return `At the roundabout, take exit ${exit} onto ${roadName || 'the road'}.`;
      case 'arrive':
        return `You have arrived at your destination on ${roadName || 'the right'}.`;
      default:
        return `Continue to ${roadName || 'your destination'}.`;
    }
  };

  const getDirectionIcon = (maneuver) => {
    const type = maneuver.type;
    const modifier = maneuver.modifier;
    
    switch (type) {
      case 'depart': return '🚗';
      case 'arrive': return '🏁';
      case 'turn':
        if (modifier === 'left') return '↰';
        if (modifier === 'right') return '↱';
        if (modifier === 'sharp left') return '⤴';
        if (modifier === 'sharp right') return '⤵';
        if (modifier === 'slight left') return '↖';
        if (modifier === 'slight right') return '↗';
        return '➡';
      case 'merge': return '🔀';
      case 'roundabout': return '🔄';
      case 'continue': return '⬆';
      default: return '➡';
    }
  };

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)} m`;
    } else {
      return `${(distance / 1000).toFixed(1)} km`;
    }
  };

  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    } else {
      return `${minutes}m`;
    }
  };

  // Helper function to convert OpenRouteService step types to icons
  const getDirectionIconFromORS = (stepType) => {
    const iconMap = {
      0: '🚗', // Depart
      1: '➡️', // Straight
      2: '↗️', // Slight right
      3: '↱', // Right
      4: '⤵', // Sharp right
      5: '🔄', // U-turn
      6: '⤴', // Sharp left
      7: '↰', // Left
      8: '↖️', // Slight left
      9: '⬆️', // Continue
      10: '🛣️', // Enter highway
      11: '🚪', // Exit highway
      12: '🔄', // Roundabout
      13: '🏁' // Arrive
    };
    
    return iconMap[stepType] || '➡️';
  };

  // Calculate straight line distance fallback
  const calculateStraightLineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  // Try OSRM service
  const tryOSRM = async (startCoords, endCoords) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=full&geometries=geojson&alternatives=true&steps=true&annotations=true`,
        { 
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`OSRM HTTP error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error('OSRM: No routes found');
      }

      // Process OSRM routes
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

          return {
            id: stepIndex,
            instruction,
            icon,
            distance: formatDistance(step.distance),
            duration: formatDuration(Math.round(step.duration / 60)),
            roadName,
            maneuver: step.maneuver,
            coordinates: stepCoordinates,
            rawDistance: step.distance,
            isCompleted: false
          };
        });

        return {
          id: index,
          coordinates,
          distance: parseFloat(distance),
          duration: formatDuration(duration),
          name: index === 0 ? 'Optimal Route (OSRM)' : `Alternative Route ${index} (OSRM)`,
          isSelected: index === 0,
          isActive: false,
          steps
        };
      });

      return routes;

    } catch (error) {
      console.log('OSRM failed:', error.message);
      return null;
    }
  };

  // Try OpenRouteService
  const tryOpenRouteService = async (startCoords, endCoords) => {
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?start=${startCoords.lon},${startCoords.lat}&end=${endCoords.lon},${endCoords.lat}&format=geojson&instructions=true&geometry=true`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`OpenRouteService HTTP error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.features || data.features.length === 0) {
        throw new Error('OpenRouteService: No routes found');
      }

      // Process OpenRouteService response
      const feature = data.features[0];
      const coordinates = feature.geometry.coordinates.map(coord => [coord[1], coord[0]]); // ORS uses [lon, lat]
      const properties = feature.properties;
      
      const distance = (properties.segments[0].distance / 1000).toFixed(1);
      const duration = Math.round(properties.segments[0].duration / 60);

      // Process steps from OpenRouteService
      const steps = properties.segments[0].steps.map((step, stepIndex) => {
        // Extract coordinates for this step
        const stepStart = step.way_points[0];
        const stepEnd = step.way_points[1];
        const stepCoordinates = coordinates.slice(stepStart, stepEnd + 1);

        return {
          id: stepIndex,
          instruction: step.instruction || 'Continue',
          icon: getDirectionIconFromORS(step.type),
          distance: formatDistance(step.distance),
          duration: formatDuration(Math.round(step.duration / 60)),
          roadName: step.name || 'Unnamed road',
          coordinates: stepCoordinates,
          rawDistance: step.distance,
          isCompleted: false
        };
      });

      return [{
        id: 0,
        coordinates,
        distance: parseFloat(distance),
        duration: formatDuration(duration),
        name: 'Route (OpenRouteService)',
        isSelected: true,
        isActive: false,
        steps
      }];

    } catch (error) {
      console.log('OpenRouteService failed:', error.message);
      return null;
    }
  };

  // Main routing function with fallback
  const getRoutes = async (startCoords, endCoords) => {
    try {
      // First try OSRM
      const osrmResult = await tryOSRM(startCoords, endCoords);
      if (osrmResult) {
        return osrmResult;
      }

      // If OSRM fails, try OpenRouteService
      const orsResult = await tryOpenRouteService(startCoords, endCoords);
      if (orsResult) {
        return orsResult;
      }

      // If both fail, fallback to straight line
      throw new Error('Both routing services unavailable');

    } catch (error) {
      console.error('All routing services failed:', error);
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

  // Function for searching routes based on user input
  const handleSearchRoute = async (startPoint, destination, mapRef, updateFuelCost, setError) => {
    if (startPoint.trim() === '' || destination.trim() === '') {
      setError('Please fill in both fields!');
      return null;
    }

    setIsLoading(true);
    setError('');
    setActiveRoute(null);

    try {
      const startResult = await getCoordinates(startPoint);
      const destinationResult = await getCoordinates(destination);

      setStartCoords(startResult);
      setDestinationCoords(destinationResult);

      const routes = await getRoutes(startResult, destinationResult);
      setAvailableRoutes(routes);
      setSelectedRouteIndex(0);

      if (routes.length > 0) {
        const selectedRoute = routes[0];
        updateFuelCost(selectedRoute.distance, null, null);
        
        // Center map on the first route
        centerMapOnRoute(selectedRoute, mapRef);

        // Return the route data so App.js can use it
        return {
          distance: selectedRoute.distance,
          duration: Math.round(selectedRoute.duration),
          coordinates: selectedRoute.coordinates
        };
      }

      return null;

    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function for selecting a route from the map
  const handleRouteClick = (routeIndex, updateFuelCost) => {
    const updatedRoutes = availableRoutes.map((route, index) => ({
      ...route,
      isSelected: index === routeIndex,
      isActive: false
    }));
    
    setAvailableRoutes(updatedRoutes);
    setSelectedRouteIndex(routeIndex);
    setActiveRoute(null);

    const selectedRoute = updatedRoutes[routeIndex];
    updateFuelCost(selectedRoute.distance);
  };

  // Function for activating selected route
  const handleStartRoute = (setDirections, setShowDirections, setCurrentStepIndex, setTripStartTime, setTripEndTime, fuelCost, setError) => {
    if (availableRoutes.length > 0) {
      const updatedRoutes = availableRoutes.map((route, idx) => ({
        ...route,
        isActive: idx === selectedRouteIndex,
        isSelected: false,
        name: idx === selectedRouteIndex ? 'Active Route' : route.name
      }));

      setAvailableRoutes(updatedRoutes);
      const activeRoute = updatedRoutes[selectedRouteIndex];
      setActiveRoute(activeRoute);
      setDirections(activeRoute.steps || []);
      setShowDirections(true);
      setCurrentStepIndex(0);
      setTripStartTime(new Date());
      setTripEndTime(null);

      setError(`Route activated: ${activeRoute.distance} km - Fuel cost: ${fuelCost} RON`);
      setTimeout(() => setError(''), 3000);
    }
  };

  // Function for canceling active route
  const handleCancelRoute = (clearSearch, setShowDirections, setDirections, setCurrentStepIndex, setTripStartTime, setTripEndTime, setIsCompletingTrip, setFuelCost, setError) => {
    setAvailableRoutes([]);
    setActiveRoute(null);
    setSelectedRouteIndex(0);
    setStartCoords(null);
    setDestinationCoords(null);
    clearSearch();
    setFuelCost(0);
    setError('');
    setShowDirections(false);
    setDirections([]);
    setCurrentStepIndex(0);
    setTripStartTime(null);
    setTripEndTime(null);
    setIsCompletingTrip(false);
  };

  return {
    startCoords,
    destinationCoords,
    isLoading,
    availableRoutes,
    selectedRouteIndex,
    activeRoute,
    setSelectedRouteIndex,
    handleSearchRoute,
    handleRouteClick,
    handleStartRoute,
    handleCancelRoute
  };
};