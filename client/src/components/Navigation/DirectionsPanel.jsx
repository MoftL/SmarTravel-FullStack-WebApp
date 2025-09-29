import React from 'react';

const DirectionsPanel = ({ 
  showDirections, 
  directions, 
  currentStepIndex, 
  directionsRef, 
  onToggleDirections, 
  onPreviousStep, 
  onNextStep,
  mapRef  
}) => {
  
  // Function to center map on current step
  const centerMapOnCurrentStep = (stepIndex) => {
    if (mapRef && mapRef.current && directions[stepIndex] && directions[stepIndex].coordinates) {
      const step = directions[stepIndex];
      if (step.coordinates && step.coordinates.length > 0) {
        const [lat, lon] = step.coordinates[0]; // Get first coordinate of the step
        mapRef.current.setView([lat, lon], 17); // Higher zoom for step-by-step navigation
      }
    }
  };

  // Enhanced previous step function with map sync
  const handlePreviousStep = () => {
    const newIndex = Math.max(0, currentStepIndex - 1);
    onPreviousStep();
    
    // Center map on new step after a short delay
    setTimeout(() => {
      centerMapOnCurrentStep(newIndex);
    }, 100);
  };

  // Enhanced next step function with map sync
  const handleNextStep = () => {
    const newIndex = Math.min(directions.length - 1, currentStepIndex + 1);
    onNextStep();
    
    // Center map on new step after a short delay
    setTimeout(() => {
      centerMapOnCurrentStep(newIndex);
    }, 100);
  };

  // Function to jump to specific step
  const jumpToStep = (stepIndex) => {
    // This would need to be passed from parent, but for now we'll use the existing functions
    const stepsToMove = stepIndex - currentStepIndex;
    
    if (stepsToMove > 0) {
      for (let i = 0; i < stepsToMove; i++) {
        setTimeout(() => onNextStep(), i * 50);
      }
    } else if (stepsToMove < 0) {
      for (let i = 0; i < Math.abs(stepsToMove); i++) {
        setTimeout(() => onPreviousStep(), i * 50);
      }
    }
    
    // Center map on selected step
    setTimeout(() => {
      centerMapOnCurrentStep(stepIndex);
    }, Math.abs(stepsToMove) * 50 + 100);
  };

  if (!showDirections || directions.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '10px',
      zIndex: 1000,
      width: '350px',
      maxHeight: '400px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      border: '2px solid #007bff',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 15px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1001
      }}>
        <div style={{
          fontWeight: 'bold',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ marginRight: '8px', fontSize: '16px' }}>🧭</span>
          Turn-by-Turn Directions
        </div>
        <button
          onClick={onToggleDirections}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '2px'
          }}
        >
          ❌
        </button>
      </div>

      {/* Current Step Highlight */}
      <div style={{
        padding: '10px 15px',
        backgroundColor: '#e3f2fd',
        borderBottom: '1px solid #bbdefb',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#1976d2'
      }}>
        Step {currentStepIndex + 1} of {directions.length}
        <button
          onClick={() => centerMapOnCurrentStep(currentStepIndex)}
          style={{
            marginLeft: '10px',
            padding: '2px 8px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '10px',
            cursor: 'pointer'
          }}
        >
          Center Map
        </button>
      </div>

      {/* Directions Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }} ref={directionsRef}>
        {directions.map((direction, index) => (
          <div
            key={direction.id}
            data-step-index={index}
            onClick={() => jumpToStep(index)}
            style={{
              padding: '10px',
              marginBottom: '8px',
              backgroundColor: index === currentStepIndex ? 'rgba(40, 167, 69, 0.1)' : 'rgba(248, 249, 250, 0.8)',
              border: index === currentStepIndex ? '2px solid #28a745' : '1px solid #e9ecef',
              borderRadius: '6px',
              boxShadow: index === currentStepIndex ? '0 2px 5px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.1)',
              fontSize: '12px',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              if (index !== currentStepIndex) {
                e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
              }
            }}
            onMouseOut={(e) => {
              if (index !== currentStepIndex) {
                e.currentTarget.style.backgroundColor = 'rgba(248, 249, 250, 0.8)';
              }
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '6px'
            }}>
              <span style={{ 
                fontSize: '18px', 
                marginRight: '10px',
                minWidth: '24px',
                textAlign: 'center'
              }}>
                {direction.icon}
              </span>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: 1
              }}>
                <span style={{ 
                  fontWeight: 'bold',
                  color: index === currentStepIndex ? '#155724' : '#495057',
                  fontSize: '13px'
                }}>
                  {direction.distance}
                </span>
                {direction.duration && direction.duration !== 'N/A' && (
                  <span style={{
                    fontSize: '11px',
                    color: '#6c757d',
                    backgroundColor: 'rgba(108, 117, 125, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}>
                    {direction.duration}
                  </span>
                )}
              </div>
              {/* Step number indicator */}
              <span style={{
                fontSize: '10px',
                color: index === currentStepIndex ? '#28a745' : '#6c757d',
                backgroundColor: index === currentStepIndex ? 'rgba(40, 167, 69, 0.2)' : 'rgba(108, 117, 125, 0.1)',
                padding: '2px 6px',
                borderRadius: '10px',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {index + 1}
              </span>
            </div>
            <div style={{
              color: index === currentStepIndex ? '#155724' : '#495057',
              lineHeight: '1.4',
              marginLeft: '34px'
            }}>
              {direction.instruction}
            </div>
            {direction.roadName && direction.roadName !== 'Unnamed road' && (
              <div style={{
                fontSize: '10px',
                color: '#6c757d',
                fontStyle: 'italic',
                marginTop: '4px',
                marginLeft: '34px'
              }}>
                via {direction.roadName}
              </div>
            )}
            {/* Current step indicator */}
            {index === currentStepIndex && (
              <div style={{
                marginTop: '6px',
                marginLeft: '34px',
                fontSize: '10px',
                color: '#28a745',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '4px' }}>📍</span>
                Current Step
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation buttons - sticky at bottom */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        background: 'rgba(255,255,255,0.95)',
        borderTop: '1px solid #e9ecef',
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        padding: '10px'
      }}>
        <button
          onClick={handlePreviousStep}
          disabled={currentStepIndex === 0}
          style={{
            padding: '8px 16px',
            backgroundColor: currentStepIndex === 0 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '12px',
            cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          ⬅️ Previous
        </button>
        
        {/* Center on current step button */}
        <button
          onClick={() => centerMapOnCurrentStep(currentStepIndex)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📍 Center
        </button>
        
        <button
          onClick={handleNextStep}
          disabled={currentStepIndex === directions.length - 1}
          style={{
            padding: '8px 16px',
            backgroundColor: currentStepIndex === directions.length - 1 ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '12px',
            cursor: currentStepIndex === directions.length - 1 ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          Next ➡️
        </button>
      </div>
    </div>
  );
};

export default DirectionsPanel;