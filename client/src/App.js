import React, { useState, useRef, useEffect } from 'react';

// Import components
import Header from './components/UI/Header';
import SearchPanel from './components/Search/SearchPanel';
import MapComponent from './components/Map/MapContainer';
import DirectionsPanel from './components/Navigation/DirectionsPanel';
import AuthModal from './components/Auth/AuthModal';
import TripHistory from './components/Trips/TripHistory';

// Import custom hooks
import { useLocationSearch } from './hooks/useLocationSearch';
import { useRouting } from './hooks/useRouting';
import { useFuelCalculator } from './hooks/useFuelCalculator';
import { useNavigation } from './hooks/useNavigation';

// Import API services
import { authAPI, tripAPI } from './services/api';

function App() {
  // Authentication state
  const [showAuth, setShowAuth] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [user, setUser] = useState(null);

  // Error state
  const [error, setError] = useState(null);

  // Trip completion state
  const [isCompletingTrip, setIsCompletingTrip] = useState(false);
  const [currentTripId, setCurrentTripId] = useState(null);

  // References
  const mapRef = useRef(null);
  const directionsRef = useRef(null);

  // Custom hooks
  const locationSearch = useLocationSearch();
  const routing = useRouting();
  const fuelCalculator = useFuelCalculator();
  const navigation = useNavigation();

  // Check if user is already logged in on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (authAPI.isLoggedIn()) {
        // Optionally fetch user data here if needed
      }
    };
    checkAuthStatus();
  }, []);

  // Fetch fuel price on component mount
  useEffect(() => {
  fuelCalculator.updateFuelPrice(routing.availableRoutes, routing.selectedRouteIndex, setError);
}, []);

  // Auto-scroll to current step when directions are shown
  useEffect(() => {
    if (navigation.showDirections && navigation.directions.length > 0) {
      const timeout = setTimeout(() => {
        if (directionsRef.current) {
          const stepElement = directionsRef.current.querySelector(`[data-step-index="${navigation.currentStepIndex}"]`);
          if (stepElement) {
            stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [navigation.showDirections, navigation.directions, navigation.currentStepIndex]);

  // Utility functions
  const calculateFuelCost = (distance, consumption, price) => {
    const litersNeeded = (distance * consumption) / 100;
    const cost = litersNeeded * price;
    return cost.toFixed(2);
  };

  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
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

  const refreshUserFromBackend = async () => {
  if (!user) return;
  
  try {
    const response = await fetch(`http://localhost:5000/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const userData = await response.json();
      setUser(userData.user);
      return userData.user;
    }
  } catch (error) {
    // Fallback: calculate from trip history
    try {
      const tripsResponse = await tripAPI.getMyTrips();
      const trips = tripsResponse.trips || [];
      
      const calculatedStats = {
        totalTrips: trips.length,
        totalDistance: trips.reduce((sum, trip) => sum + trip.distance, 0),
        totalFuelCost: trips.reduce((sum, trip) => sum + trip.fuelCost, 0)
      };
      
      const updatedUser = {
        ...user,
        ...calculatedStats
      };
      
      setUser(updatedUser);
      return updatedUser;
    } catch (fallbackError) {
      return user;
    }
  }
};

  // Authentication handlers
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);
    
    // Update fuel consumption from user preferences
    if (userData.defaultFuelConsumption) {
      fuelCalculator.setFuelConsumption(userData.defaultFuelConsumption.toString());
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setShowHistory(false);
      setCurrentTripId(null);
    } catch (error) {
      setError('Logout failed. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Route search and trip management
  const handleSearchRoute = async () => {
    // Let the routing hook handle the UI updates
    await routing.handleSearchRoute(
      locationSearch.startPoint,
      locationSearch.destination,
      mapRef,
      fuelCalculator.updateFuelCost,
      setError
    );

    navigation.setDirections([]);
    navigation.setShowDirections(false);
    navigation.setCurrentStepIndex(0);

    // If user is logged in, save route to backend
    if (user && locationSearch.startPoint && locationSearch.destination) {
      try {
        // Get coordinates
        const startCoords = await getCoordinates(locationSearch.startPoint);
        const destCoords = await getCoordinates(locationSearch.destination);
        
        // Get route using OSRM directly
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${destCoords.lon},${destCoords.lat}?overview=full&geometries=geojson&alternatives=true&steps=true`
        );
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distance = (route.distance / 1000);
          const duration = Math.round(route.duration / 60);
          
          // Calculate fuel cost properly
          const fuelCost = calculateFuelCost(
            distance, 
            parseFloat(fuelCalculator.fuelConsumption), 
            parseFloat(fuelCalculator.fuelPrice)
          );
          
          const tripData = {
            startPoint: locationSearch.startPoint,
            destination: locationSearch.destination,
            startCoordinates: startCoords,
            destinationCoordinates: destCoords,
            distance: distance,
            estimatedDuration: duration,
            fuelConsumption: parseFloat(fuelCalculator.fuelConsumption),
            fuelCost: parseFloat(fuelCost)
          };

          const tripResponse = await tripAPI.create(tripData);
          setCurrentTripId(tripResponse.trip._id);
          setError('Route found and saved to your account!');
          setTimeout(() => setError(null), 3000);
        }
        
      } catch (error) {
        setError('Route found but failed to save to account.');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Start route handler
  const handleStartRoute = async () => {
    routing.handleStartRoute(
      navigation.setDirections,
      navigation.setShowDirections,
      navigation.setCurrentStepIndex,
      navigation.setTripStartTime,
      navigation.setTripEndTime,
      fuelCalculator.fuelCost,
      setError
    );

    // Center map on starting point when route starts
    if (routing.startCoords && mapRef.current) {
      mapRef.current.setView([routing.startCoords.lat, routing.startCoords.lon], 15);
    }

    // If user is logged in and we have a backend trip ID, start it on backend
    if (user && currentTripId) {
      try {
        await tripAPI.start(currentTripId);
        setError('Trip started and synced with your account!');
        setTimeout(() => setError(null), 3000);
      } catch (error) {
        setError('Trip started locally. Backend sync failed.');
        setTimeout(() => setError(null), 3000);
      }
    } else {
      setError('Trip started locally (not saved to account)');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Complete trip handler
  const handleCompleteTrip = async () => {
  if (!routing.activeRoute || !navigation.tripStartTime) {
    return;
  }
  
  setIsCompletingTrip(true);

  try {
    await navigation.handleCompleteTrip(
      routing.activeRoute,
      locationSearch.startPoint,
      locationSearch.destination,
      fuelCalculator.fuelCost,
      fuelCalculator.fuelConsumption,
      fuelCalculator.fuelPrice,
      setError
    );

    if (user && currentTripId) {
      try {
        await tripAPI.complete(currentTripId);
        
        // Force refresh user stats from backend after completion
        const updatedUser = await refreshUserFromBackend();
        if (updatedUser) {
          setError(`Trip completed and saved! Total trips: ${updatedUser.totalTrips}`);
        } else {
          setError('Trip completed and saved!');
        }
        
        setCurrentTripId(null);
        
      } catch (error) {
        setError('Trip completed locally! (Backend save failed)');
      }
    } else {
      setError('Trip completed locally (not saved to account)');
    }
    
    setTimeout(() => {
      handleCancelRoute();
    }, 2000);
    
  } finally {
    setIsCompletingTrip(false);
    setTimeout(() => setError(null), 5000);
  }
};

  // Cancel route handler
  const handleCancelRoute = () => {
    // Clear routing state
    routing.handleCancelRoute(
      locationSearch.clearSearch,
      navigation.setShowDirections,
      navigation.setDirections,
      navigation.setCurrentStepIndex,
      navigation.setTripStartTime,
      navigation.setTripEndTime,
      setIsCompletingTrip,
      fuelCalculator.setFuelCost,
      setError
    );

    // Clear backend trip ID
    setCurrentTripId(null);
  };

  // Refresh user data after trip deletion with proper calculation
  const refreshUserData = (deletedTrip) => {
    if (user && deletedTrip) {
      const updatedUser = {
        ...user,
        totalTrips: Math.max(0, (user.totalTrips || 1) - 1),
        totalDistance: Math.max(0, (user.totalDistance || 0) - deletedTrip.distance),
        totalFuelCost: Math.max(0, (user.totalFuelCost || 0) - deletedTrip.fuelCost)
      };
      setUser(updatedUser);
    }
  };

  const handleRouteClick = (routeIndex) => {
    routing.handleRouteClick(routeIndex, fuelCalculator.updateFuelCost);
  };

  const handleFuelConsumptionChange = (event) => {
    fuelCalculator.handleFuelConsumptionChange(event, routing.availableRoutes, routing.selectedRouteIndex);
  };

  const handleFuelPriceChange = (event) => {
    fuelCalculator.handleFuelPriceChange(event, routing.availableRoutes, routing.selectedRouteIndex);
  };

  const handleUpdateFuelPrice = () => {
    fuelCalculator.updateFuelPrice(routing.availableRoutes, routing.selectedRouteIndex, setError);
  };

  const handleShowHistory = async () => {
  setShowHistory(true);
  // Refresh user stats when opening trip history
  await refreshUserFromBackend();
};

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      {/* Header with auth buttons */}
      <Header 
        user={user}
        onShowAuth={() => setShowAuth(true)}
        onShowHistory={handleShowHistory}
        onLogout={handleLogout}
      />

      {/* Search Panel */}
      <SearchPanel
        // Location search props
        startPoint={locationSearch.startPoint}
        destination={locationSearch.destination}
        startSuggestions={locationSearch.startSuggestions}
        destinationSuggestions={locationSearch.destinationSuggestions}
        showStartSuggestions={locationSearch.showStartSuggestions}
        showDestinationSuggestions={locationSearch.showDestinationSuggestions}
        setShowStartSuggestions={locationSearch.setShowStartSuggestions}
        setShowDestinationSuggestions={locationSearch.setShowDestinationSuggestions}
        onStartPointChange={locationSearch.handleStartPointChange}
        onDestinationChange={locationSearch.handleDestinationChange}
        onSelectSuggestion={locationSearch.selectSuggestion}
        
        // Fuel calculator props
        fuelConsumption={fuelCalculator.fuelConsumption}
        fuelPrice={fuelCalculator.fuelPrice}
        fuelCost={fuelCalculator.fuelCost}
        isLoadingFuelPrice={fuelCalculator.isLoadingFuelPrice}
        onFuelConsumptionChange={handleFuelConsumptionChange}
        onFuelPriceChange={handleFuelPriceChange}
        onUpdateFuelPrice={handleUpdateFuelPrice}
        
        // Route props
        isLoading={routing.isLoading}
        availableRoutes={routing.availableRoutes}
        selectedRouteIndex={routing.selectedRouteIndex}
        activeRoute={routing.activeRoute}
        onSearchRoute={handleSearchRoute}
        onStartRoute={handleStartRoute}
        onCancelRoute={handleCancelRoute}
        onRouteClick={handleRouteClick}
        
        // Navigation props
        directions={navigation.directions}
        showDirections={navigation.showDirections}
        tripStartTime={navigation.tripStartTime}
        tripEndTime={navigation.tripEndTime}
        isCompletingTrip={isCompletingTrip}
        onToggleDirections={navigation.toggleDirections}
        onCompleteTrip={handleCompleteTrip}
        
        // Error handling
        error={error}
        
        // User info for conditional features
        user={user}
      />

      {/* Directions Panel */}
      <DirectionsPanel
        showDirections={navigation.showDirections}
        directions={navigation.directions}
        currentStepIndex={navigation.currentStepIndex}
        directionsRef={directionsRef}
        onToggleDirections={navigation.toggleDirections}
        onPreviousStep={() => navigation.setCurrentStepIndex(idx => Math.max(0, idx - 1))}
        onNextStep={() => navigation.setCurrentStepIndex(idx => Math.min(navigation.directions.length - 1, idx + 1))}
        mapRef={mapRef}
      />

      {/* Map */}
      <MapComponent
        mapRef={mapRef}
        startCoords={routing.startCoords}
        destinationCoords={routing.destinationCoords}
        availableRoutes={routing.availableRoutes}
        onRouteClick={handleRouteClick}
      />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Trip History Modal */}
      <TripHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        user={user}
        onTripDeleted={refreshUserData}
      />
    </div>
  );
}

export default App;