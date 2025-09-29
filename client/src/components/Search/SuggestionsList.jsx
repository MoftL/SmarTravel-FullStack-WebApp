import React from 'react';

const SuggestionsList = ({ suggestions, onSelectSuggestion, show }) => {
  if (!show || suggestions.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderTop: 'none',
      borderRadius: '0 0 5px 5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      zIndex: 1001,
      maxHeight: '200px',
      overflowY: 'auto'
    }}>
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          onClick={() => onSelectSuggestion(suggestion)}
          style={{
            padding: '10px',
            cursor: 'pointer',
            borderBottom: index < suggestions.length - 1 ? '1px solid #ddd' : 'none',
            fontSize: '12px',
            color: '#333'
          }}
          onMouseEnter={(e) => {e.target.style.backgroundColor = '#f0f0f0';}}
          onMouseLeave={(e) => {e.target.style.backgroundColor = 'white';}}
        >
          {suggestion.display_name}
        </div>
      ))}
    </div>
  );
};

export default SuggestionsList;