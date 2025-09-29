import { useState } from 'react';

export const useFuelCalculator = () => {
  const [fuelConsumption, setFuelConsumption] = useState('7.5');
  const [fuelPrice, setFuelPrice] = useState('6.8');
  const [fuelCost, setFuelCost] = useState(0);
  const [isLoadingFuelPrice, setIsLoadingFuelPrice] = useState(false);

  const calculateFuelCost = (distance, consumption, price) => {
    const litersNeeded = (distance * consumption) / 100;
    const cost = litersNeeded * price;
    return cost.toFixed(2);
  };

  const updateFuelCost = (distance, consumption, price) => {
    const cost = calculateFuelCost(distance, consumption || fuelConsumption, price || fuelPrice);
    setFuelCost(cost);
  };

  const handleFuelConsumptionChange = (event, availableRoutes, selectedRouteIndex) => {
    const value = event.target.value;
    setFuelConsumption(value);
    
    if (availableRoutes.length > 0) {
      const selectedRoute = availableRoutes[selectedRouteIndex];
      const cost = calculateFuelCost(selectedRoute.distance, parseFloat(value), parseFloat(fuelPrice));
      setFuelCost(cost);
    }
  };

  const handleFuelPriceChange = (event, availableRoutes, selectedRouteIndex) => {
    const value = event.target.value;
    setFuelPrice(value);
    
    if (availableRoutes.length > 0) {
      const selectedRoute = availableRoutes[selectedRouteIndex];
      const cost = calculateFuelCost(selectedRoute.distance, parseFloat(fuelConsumption), parseFloat(value));
      setFuelCost(cost);
    }
  };

  const updateFuelPrice = async (availableRoutes, selectedRouteIndex, setError) => {
    setIsLoadingFuelPrice(true);
    try {
      const mockApiResponse = await new Promise((resolve) => {
        setTimeout(() => {
          const basePrice = Math.random() > 0.5 ? 6.7 : 7.3;
          const currentPrice = (basePrice + Math.random() * 0.4 - 0.2).toFixed(2);
          resolve({
            success: true,
            price: currentPrice,
          });
        }, 1500);
      });
      
      if (mockApiResponse.success) {
        setFuelPrice(mockApiResponse.price);
        
        if (availableRoutes.length > 0) {
          const selectedRoute = availableRoutes[selectedRouteIndex];
          const cost = calculateFuelCost(selectedRoute.distance, parseFloat(fuelConsumption), parseFloat(mockApiResponse.price));
          setFuelCost(cost);
        }
      }
    } catch (error) {
      console.error('Failed to fetch fuel price:', error);
      setError('Failed to update fuel price. Using current value.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoadingFuelPrice(false);
    }
  };

  return {
    fuelConsumption,
    setFuelConsumption, // Export this function
    fuelPrice,
    setFuelPrice,
    fuelCost,
    setFuelCost,
    isLoadingFuelPrice,
    updateFuelCost,
    handleFuelConsumptionChange,
    handleFuelPriceChange,
    updateFuelPrice
  };
};