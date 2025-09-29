import React from 'react';
import LocationInput from './LocationInput';
import FuelCalculator from '../Fuel/FuelCalculator';
import RouteControls from '../Route/RouteControls';
import ActiveRouteInfo from '../Route/ActiveRouteInfo';
import RouteAlternatives from '../Route/RouteAlternatives';
import { UI_CONFIG } from '../../constants';

const SearchPanel = ({
  // Location search props
  startPoint,
  destination,
  startSuggestions,
  destinationSuggestions,
  showStartSuggestions,
  showDestinationSuggestions,
  setShowStartSuggestions,
  setShowDestinationSuggestions,
  onStartPointChange,
  onDestinationChange,
  onSelectSuggestion,
  
  // Fuel calculator props
  fuelConsumption,
  fuelPrice,
  fuelCost,
  isLoadingFuelPrice,
  onFuelConsumptionChange,
  onFuelPriceChange,
  onUpdateFuelPrice,
  
  // Route props
  isLoading,
  availableRoutes,
  selectedRouteIndex,
  activeRoute,
  onSearchRoute,
  onStartRoute,
  onCancelRoute,
  onRouteClick,
  
  // Navigation props
  directions,
  showDirections,
  tripStartTime,
  tripEndTime,
  isCompletingTrip,
  onToggleDirections,
  onCompleteTrip,
  
  // Error handling
  error
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: '90px',
      left: '10px',
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      width: UI_CONFIG.SEARCH_PANEL_WIDTH,
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Starting point field */}
        <LocationInput
          value={startPoint}
          placeholder="Starting point..."
          onChange={onStartPointChange}
          onFocus={() => startSuggestions.length > 0 && setShowStartSuggestions(true)}
          suggestions={startSuggestions}
          showSuggestions={showStartSuggestions}
          onSelectSuggestion={(suggestion) => onSelectSuggestion(suggestion, 'start')}
        />

        {/* Destination field */}
        <LocationInput
          value={destination}
          placeholder="Destination..."
          onChange={onDestinationChange}
          onFocus={() => destinationSuggestions.length > 0 && setShowDestinationSuggestions(true)}
          suggestions={destinationSuggestions}
          showSuggestions={showDestinationSuggestions}
          onSelectSuggestion={(suggestion) => onSelectSuggestion(suggestion, 'destination')}
        />

        {/* Fuel Calculator Section */}
        <FuelCalculator
          fuelConsumption={fuelConsumption}
          fuelPrice={fuelPrice}
          isLoadingFuelPrice={isLoadingFuelPrice}
          onConsumptionChange={onFuelConsumptionChange}
          onPriceChange={onFuelPriceChange}
          onUpdatePrice={onUpdateFuelPrice}
        />
        
        {/* Route Controls */}
        <RouteControls
          isLoading={isLoading}
          activeRoute={activeRoute}
          availableRoutes={availableRoutes}
          selectedRouteIndex={selectedRouteIndex}
          fuelCost={fuelCost}
          isCompletingTrip={isCompletingTrip}
          tripStartTime={tripStartTime}
          onSearchRoute={onSearchRoute}
          onStartRoute={onStartRoute}
          onCancelRoute={onCancelRoute}
          onCompleteTrip={onCompleteTrip}
        />
        
        {/* Display errors or success messages */}
        {error && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: error.includes('activated') || error.includes('completed') ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
            border: error.includes('activated') || error.includes('completed') ? '1px solid #28a745' : '1px solid #dc3545',
            borderRadius: '5px',
            color: error.includes('activated') || error.includes('completed') ? '#155724' : '#dc3545',
            fontSize: '12px'
          }}>
            {error}
          </div>
        )}

        {/* Active route information */}
        <ActiveRouteInfo
          activeRoute={activeRoute}
          fuelCost={fuelCost}
          tripStartTime={tripStartTime}
          tripEndTime={tripEndTime}
          directions={directions}
          showDirections={showDirections}
          onToggleDirections={onToggleDirections}
        />
        
        {/* Route alternatives display */}
        <RouteAlternatives
          availableRoutes={availableRoutes}
          onRouteClick={onRouteClick}
          fuelConsumption={fuelConsumption}
          fuelPrice={fuelPrice}
        />
      </div>
    </div>
  );
};

export default SearchPanel;