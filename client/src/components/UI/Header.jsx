import React from 'react';

const Header = ({ user, onShowAuth, onLogout, onShowHistory }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      {/* SmarTravel Logo */}
      <img 
        src="/logo.png" 
        alt="SmarTravel" 
        style={{ 
          marginTop: '30px',
          height: '175px',
          width: 'auto',
          cursor: 'pointer'
        }}
      />

      {/* Authentication Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        {user ? (
          // Logged in state
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            {/* User info */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '8px 15px',
              borderRadius: '20px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#007bff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#333'
                }}>
                  {user.username || 'User'}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {user.totalTrips || 0} trips
                </div>
              </div>
            </div>

            {/* Trip History button */}
            <button
              onClick={onShowHistory}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
            >
              Trip History
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
            >
              Logout
            </button>
          </div>
        ) : (
          // Not logged in state
          <button
            onClick={onShowAuth}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,123,255,0.3)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Login / Register
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;