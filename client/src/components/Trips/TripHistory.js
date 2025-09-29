import React, { useState, useEffect } from 'react';
import { tripAPI } from '../../services/api';

const TripHistory = ({ isOpen, onClose, user, onTripDeleted }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingTripId, setDeletingTripId] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchTrips();
    }
  }, [isOpen, user]);

  const fetchTrips = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await tripAPI.getMyTrips();
      setTrips(response.trips);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    setDeletingTripId(tripId);
    
    try {
      await tripAPI.delete(tripId);
      
      // Remove trip from local state
      setTrips(trips.filter(trip => trip._id !== tripId));
      
      // Notify parent component to update user stats
      onTripDeleted();
      
      setError('Trip deleted successfully');
      setTimeout(() => setError(''), 2000);
    } catch (error) {
      setError('Failed to delete trip: ' + error.message);
    } finally {
      setDeletingTripId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getStatusBadge = (status) => {
    const colors = {
      'planned': '#6c757d',
      'active': '#007bff',
      'completed': '#28a745',
      'cancelled': '#dc3545'
    };

    return (
      <span style={{
        backgroundColor: colors[status] || '#6c757d',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: 'bold'
      }}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 25px',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '15px 15px 0 0'
        }}>
          <div>
            <h2 style={{
              margin: '0 0 5px 0',
              color: '#333',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              Trip History
            </h2>
            <p style={{
              margin: 0,
              color: '#666',
              fontSize: '14px'
            }}>
              Manage all your completed trips
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '0',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px 25px'
        }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              fontSize: '16px',
              color: '#666'
            }}>
              Loading your trips...
            </div>
          ) : error ? (
            <div style={{
              color: error.includes('success') || error.includes('deleted') ? '#28a745' : '#dc3545',
              textAlign: 'center',
              padding: '10px',
              backgroundColor: error.includes('success') || error.includes('deleted') ? '#d4edda' : '#f8d7da',
              borderRadius: '8px',
              border: `1px solid ${error.includes('success') || error.includes('deleted') ? '#c3e6cb' : '#f5c6cb'}`,
              marginBottom: '15px'
            }}>
              {error}
            </div>
          ) : trips.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>🗺️</div>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>No trips yet</h3>
              <p style={{ margin: 0 }}>Start planning your first route to see your trip history here!</p>
            </div>
          ) : null}

          {trips.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {trips.map((trip) => (
                <div
                  key={trip._id}
                  style={{
                    border: '1px solid #e9ecef',
                    borderRadius: '10px',
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  {/* Delete button */}
                  <button
                    onClick={() => deleteTrip(trip._id)}
                    disabled={deletingTripId === trip._id}
                    style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      backgroundColor: deletingTripId === trip._id ? '#ccc' : '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      cursor: deletingTripId === trip._id ? 'not-allowed' : 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    title="Delete trip"
                  >
                    {deletingTripId === trip._id ? '⏳' : '🗑️'}
                  </button>

                  {/* Trip header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '15px',
                    paddingRight: '45px' // Space for delete button
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '5px'
                      }}>
                        {trip.startPoint} → {trip.destination}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#666'
                      }}>
                        {formatDate(trip.createdAt)}
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(trip.status)}
                    </div>
                  </div>

                  {/* Trip details */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '15px',
                    marginBottom: '15px'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Distance</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                        {trip.distance} km
                      </div>
                    </div>
                    
                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Duration</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                        {trip.actualDuration ? 
                          `${Math.floor(trip.actualDuration / 60)}h ${trip.actualDuration % 60}m` :
                          `${Math.floor(trip.estimatedDuration / 60)}h ${trip.estimatedDuration % 60}m`
                        }
                        {trip.actualDuration && (
                          <span style={{ fontSize: '12px', color: '#666' }}> (actual)</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Fuel Cost</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
                        {trip.fuelCost.toFixed(2)} RON
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>Consumption</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
                        {trip.fuelConsumption} L/100km
                      </div>
                    </div>
                  </div>

                  {/* Trip timing for completed trips */}
                  {trip.status === 'completed' && trip.startTime && trip.endTime && (
                    <div style={{
                      backgroundColor: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#666',
                      border: '1px solid #e9ecef'
                    }}>
                      <strong>Started:</strong> {formatDate(trip.startTime)} | 
                      <strong> Completed:</strong> {formatDate(trip.endTime)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with stats */}
        {trips.length > 0 && (
          <div style={{
            borderTop: '1px solid #e9ecef',
            padding: '15px 25px',
            backgroundColor: '#f8f9fa',
            borderRadius: '0 0 15px 15px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                  {trips.length}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Total Trips</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                  {trips.reduce((sum, trip) => sum + trip.distance, 0).toFixed(1)}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Total KM</div>
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
                  {trips.reduce((sum, trip) => sum + trip.fuelCost, 0).toFixed(2)}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Total Cost (RON)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripHistory;