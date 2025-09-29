import React from 'react';
import SuggestionsList from './SuggestionsList';

const LocationInput = ({ 
  value, 
  placeholder, 
  onChange, 
  onFocus,
  suggestions,
  showSuggestions,
  onSelectSuggestion 
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        style={{
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '5px',
          fontSize: '14px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />
      
      <SuggestionsList 
        suggestions={suggestions}
        onSelectSuggestion={onSelectSuggestion}
        show={showSuggestions}
      />
    </div>
  );
};

export default LocationInput;