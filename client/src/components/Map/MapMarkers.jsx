import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { startIcon, destinationIcon, createRouteInfoIcon } from '../../utils/mapIcons';

const MapMarkers = ({ 
  startCoords, 
  destinationCoords, 
  availableRoutes, 
  onRouteClick 
}) => {
  return (
    <>
      {/* Marker for starting point */}
      {startCoords && (
        <Marker 
          position={[startCoords.lat, startCoords.lon]}
          icon={startIcon}
        >
          <Popup>
            <div style={{ fontSize: '12px' }}>
              <strong>🚗 Starting Point</strong><br/>
              {startCoords.display_name}
            </div>
          </Popup>
        </Marker>
      )}

      {/* Marker for destination */}
      {destinationCoords && (
        <Marker 
          position={[destinationCoords.lat, destinationCoords.lon]}
          icon={destinationIcon}
        >
          <Popup>
            <div style={{ fontSize: '12px' }}>
              <strong>🏁 Destination</strong><br/>
              {destinationCoords.display_name}
            </div>
          </Popup>
        </Marker>
      )}

      {/* Route information markers on map */}
      {availableRoutes.map((route, index) => {
        if (route.coordinates.length > 0) {
          const midIndex = Math.floor(route.coordinates.length / 2);
          const midPoint = route.coordinates[midIndex];
          
          return (
            <Marker
              key={`info-${route.id}`}
              position={midPoint}
              icon={createRouteInfoIcon(route, route.distance, route.duration)}
              eventHandlers={{
                click: () => onRouteClick(index)
              }}
            />
          );
        }
        return null;
      })}
    </>
  );
};

export default MapMarkers;