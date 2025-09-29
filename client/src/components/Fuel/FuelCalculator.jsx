import React from 'react';

const FuelCalculator = ({
  fuelConsumption,
  fuelPrice,
  isLoadingFuelPrice,
  onConsumptionChange,
  onPriceChange,
  onUpdatePrice
}) => {
  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h3 style={{ 
        margin: '0 0 10px 0', 
        color: 'white', 
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        ⛽ Fuel Calculator
      </h3>
      
      {/* Fuel consumption field */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '4px', 
          color: 'white', 
          fontSize: '12px' 
        }}>
          Consumption (L/100km):
        </label>
        <input
          type="number"
          value={fuelConsumption}
          onChange={onConsumptionChange}
          step="0.1"
          min="1"
          max="50"
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '3px',
            fontSize: '12px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Fuel price field */}
      <div style={{ marginBottom: '8px' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '4px', 
          color: 'white', 
          fontSize: '12px' 
        }}>
          Fuel price (RON/L):
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="number"
            value={fuelPrice}
            onChange={onPriceChange}
            step="0.01"
            min="0.1"
            max="20"
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '3px',
              fontSize: '12px',
              flex: 1,
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={onUpdatePrice}
            disabled={isLoadingFuelPrice}
            style={{
              padding: '8px',
              backgroundColor: isLoadingFuelPrice ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              fontSize: '10px',
              cursor: isLoadingFuelPrice ? 'not-allowed' : 'pointer',
              minWidth: '60px'
            }}
          >
            {isLoadingFuelPrice ? '⏳' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FuelCalculator;