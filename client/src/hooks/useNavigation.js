import { useState } from 'react';
import { formatDuration } from '../utils/formatters';

export const useNavigation = () => {
  // State for navigation directions
  const [directions, setDirections] = useState([]);
  const [showDirections, setShowDirections] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // State for trip completion
  const [tripStartTime, setTripStartTime] = useState(null);
  const [tripEndTime, setTripEndTime] = useState(null);
  const [isCompletingTrip] = useState(false);

  // Function to toggle directions panel visibility
  const toggleDirections = () => {
    setShowDirections(!showDirections);
  };

  // Function for completing the trip
  const handleCompleteTrip = async (activeRoute, startPoint, destination, fuelCost, fuelConsumption, fuelPrice) => {
    if (!activeRoute || !tripStartTime) return null;
    
    const endTime = new Date();
    setTripEndTime(endTime);

    const actualDurationMinutes = Math.round((endTime - tripStartTime) / (1000 * 60));
    const actualDurationFormatted = formatDuration(actualDurationMinutes);
    
    const tripRecord = {
      id: Date.now(),
      startPoint: startPoint,
      destination: destination,
      distance: activeRoute.distance,
      estimatedDuration: activeRoute.duration,
      actualDuration: actualDurationMinutes,
      actualDurationFormatted: actualDurationFormatted,
      fuelCost: parseFloat(fuelCost),
      fuelConsumption: parseFloat(fuelConsumption),
      fuelPrice: parseFloat(fuelPrice),
      startTime: tripStartTime,
      endTime: endTime,
      date: endTime.toDateString(),
      status: 'completed'
    };

    console.log('Trip completed:', tripRecord);
    return tripRecord;
  };

  const scrollToCurrentStep = (stepIndex, directionsRef) => {
    if(directionsRef.current) {
      const stepElement = directionsRef.current.querySelector(`[data-step-index="${stepIndex}"]`);
      if (stepElement) {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return {
    directions,
    showDirections,
    currentStepIndex,
    tripStartTime,
    tripEndTime,
    isCompletingTrip,
    setDirections,
    setShowDirections,
    setCurrentStepIndex,
    setTripStartTime,
    setTripEndTime,
    toggleDirections,
    handleCompleteTrip,
    scrollToCurrentStep
  };
};