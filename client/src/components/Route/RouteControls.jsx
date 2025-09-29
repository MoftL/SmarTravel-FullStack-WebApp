import React from 'react';

const RouteControls = ({ 
  isLoading,
  activeRoute,
  availableRoutes,
  selectedRouteIndex,
  fuelCost,
  isCompletingTrip,
  tripStartTime,
  onSearchRoute,
  onStartRoute,
  onCancelRoute,
  onCompleteTrip
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {/* Search button and Cancel button */}
      <div style={{ display: 'flex', gap: '5px' }}>
        <button
          onClick={onSearchRoute}
          disabled={isLoading}
          style={{
            padding: '12px 20px',
            backgroundColor: isLoading ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            width: activeRoute ? '50%' : '100%',
            boxSizing: 'border-box'
          }}
        >
          {isLoading ? 'Searching...' : 'Search Route'}
        </button>

        {/* Cancel Route button */}
        {activeRoute && (
          <button
            onClick={onCancelRoute}
            style={{
              padding: '12px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '50%',
              boxSizing: 'border-box'
            }}
          >
            ❌ Cancel Route
          </button>
        )}
      </div>

      {/* START ROUTE button */}
      {availableRoutes.length > 0 && !activeRoute && (
        <button
          onClick={onStartRoute}
          style={{
            padding: '12px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
            boxSizing: 'border-box',
            marginTop: '10px'
          }}
        >
          🚗 START ROUTE ({availableRoutes.find(r => r.isSelected)?.distance} km - {availableRoutes.find(r => r.isSelected)?.duration} - {fuelCost} RON)
        </button>
      )}

      {/* Complete Trip button */}
      {activeRoute && tripStartTime && (
        <button
          onClick={onCompleteTrip}
          disabled={isCompletingTrip}
          style={{
            padding: '10px 15px',
            backgroundColor: isCompletingTrip ? '#6c757d' : '#ffc107',
            color: isCompletingTrip ? 'white' : '#212529',
            border: 'none',
            borderRadius: '5px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: isCompletingTrip ? 'not-allowed' : 'pointer',
            width: '100%',
            boxSizing: 'border-box',
            marginTop: '10px'
          }}
        >
          {isCompletingTrip ? '⏳ Completing...' : '🏁 Complete Trip'}
        </button>
      )}
    </div>
  );
};

export default RouteControls;