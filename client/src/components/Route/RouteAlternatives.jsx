import React from 'react';
import { calculateFuelCost } from '../../utils/calculations';

const RouteAlternatives = ({ availableRoutes, onRouteClick, fuelConsumption, fuelPrice }) => {
  if (availableRoutes.length <= 1) return null;

  return (
    <div style={{
      marginTop: '10px',
      padding: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '5px'
    }}>
      <div style={{
        fontWeight: 'bold',
        marginBottom: '8px',
        color: 'white',
        fontSize: '12px'
      }}>
        🛣️ Available Routes ({availableRoutes.length})
      </div>
      
      {availableRoutes.map((route, index) => (
        <div
          key={route.id}
          onClick={() => onRouteClick(index)}
          style={{
            padding: '6px',
            marginBottom: '4px',
            backgroundColor: route.isSelected ? 'rgba(0, 123, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
            border: route.isSelected ? '2px solid #007bff' : '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '11px',
            color: 'white'
          }}
        >
          <div style={{ fontWeight: 'bold' }}>{route.name}</div>
          <div>{route.distance} km • {route.duration}</div>
          <div>💰 {calculateFuelCost(route.distance, parseFloat(fuelConsumption), parseFloat(fuelPrice))} RON</div>
        </div>
      ))}
    </div>
  );
};

export default RouteAlternatives;