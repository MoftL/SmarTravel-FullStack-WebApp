import React from 'react';

const ActiveRouteInfo = ({ 
  activeRoute, 
  fuelCost, 
  tripStartTime, 
  tripEndTime, 
  directions, 
  showDirections, 
  onToggleDirections 
}) => {
  if (!activeRoute) return null;

  return (
    <div style={{
      marginTop: '10px',
      padding: '10px',
      backgroundColor: 'rgba(40, 167, 69, 0.1)',
      border: '2px solid #28a745',
      borderRadius: '5px',
      fontSize: '12px',
      color: '#155724'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        🚗 ACTIVE ROUTE
      </div>
      <div><strong>Distance:</strong> {activeRoute.distance} km</div>
      <div><strong>Estimated time:</strong> {activeRoute.duration}</div>
      <div><strong>💰 Fuel cost:</strong> {fuelCost} RON</div>
      
      {/* Trip timing */}
      {tripStartTime && (
        <div style={{ marginTop: '5px', fontSize: '11px', color: '#155724' }}>
          <div><strong>🕐 Started:</strong> {tripStartTime.toLocaleTimeString()}</div>
          {tripEndTime && (
            <div><strong>🏁 Completed:</strong> {tripEndTime.toLocaleTimeString()}</div>
          )}
        </div>
      )}

      {/* Toggle directions button */}
      {directions.length > 0 && (
        <button
          onClick={onToggleDirections}
          style={{
            marginTop: '8px',
            padding: '6px 12px',
            backgroundColor: showDirections ? '#dc3545' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            fontSize: '11px',
            cursor: 'pointer',
            width: '100%',
            fontWeight: 'bold'
          }}
        >
          {showDirections ? '❌ Hide Directions' : '📜 Show Directions'}
        </button>
      )}
    </div>
  );
};

export default ActiveRouteInfo;