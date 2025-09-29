import { useState } from 'react';
import { searchSuggestions } from '../services/geocoding';

export const useLocationSearch = () => {
  // State for search field values
  const [startPoint, setStartPoint] = useState('');
  const [destination, setDestination] = useState('');

  // State for suggestions and their visibility
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  // Function for selecting a suggestion
  const selectSuggestion = (suggestion, type) => {
    if (type === 'start') {
      setStartPoint(suggestion.display_name);
      setShowStartSuggestions(false);
    } else {
      setDestination(suggestion.display_name);
      setShowDestinationSuggestions(false);
    }
  };

  // Function for handling changes in the starting point field
  const handleStartPointChange = async (event) => {
    const value = event.target.value;
    setStartPoint(value);
    
    if (value.length >= 3) {
      const suggestions = await searchSuggestions(value);
      setStartSuggestions(suggestions);
      setShowStartSuggestions(true);
    } else {
      setShowStartSuggestions(false);
    }
  };

  // Function for handling changes in the destination field
  const handleDestinationChange = async (event) => {
    const value = event.target.value;
    setDestination(value);
    
    if (value.length >= 3) {
      const suggestions = await searchSuggestions(value);
      setDestinationSuggestions(suggestions);
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  const clearSearch = () => {
    setStartPoint('');
    setDestination('');
    setStartSuggestions([]);
    setDestinationSuggestions([]);
    setShowStartSuggestions(false);
    setShowDestinationSuggestions(false);
  };

  return {
    startPoint,
    destination,
    startSuggestions,
    destinationSuggestions,
    showStartSuggestions,
    showDestinationSuggestions,
    setShowStartSuggestions,
    setShowDestinationSuggestions,
    selectSuggestion,
    handleStartPointChange,
    handleDestinationChange,
    clearSearch
  };
};