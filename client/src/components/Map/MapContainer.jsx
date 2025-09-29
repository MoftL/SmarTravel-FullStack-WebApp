import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import MapMarkers from './MapMarkers';
import { MAP_CONFIG, ROUTE_COLORS, ROUTE_WEIGHTS } from '../../constants';

const MapComponent = ({ 
  mapRef,
  startCoords, 
  destinationCoords, 
  availableRoutes, 
  onRouteClick 
}) => {
  return (
    <MapContainer 
      center={MAP_CONFIG.DEFAULT_CENTER} 
      zoom={MAP_CONFIG.DEFAULT_ZOOM} 
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url={MAP_CONFIG.TILE_LAYER_URL}
        attribution={MAP_CONFIG.ATTRIBUTION}
      />

      <MapMarkers
        startCoords={startCoords}
        destinationCoords={destinationCoords}
        availableRoutes={availableRoutes}
        onRouteClick={onRouteClick}
      />

      {/* Display routes on map */}
      {availableRoutes.map((route, index) => (
        <Polyline
          key={route.id}
          positions={route.coordinates}
          eventHandlers={{
            click: () => onRouteClick(index)
          }}
          color={
            route.isActive
              ? ROUTE_COLORS.ACTIVE    // Green for active route
              : route.isSelected
              ? ROUTE_COLORS.SELECTED    // Dark blue for selected route
              : ROUTE_COLORS.ALTERNATIVE    // Medium blue for alternative routes
          }
          weight={
            route.isActive
              ? ROUTE_WEIGHTS.ACTIVE            // Very thick for active route
              : route.isSelected
              ? ROUTE_WEIGHTS.SELECTED            // Thick for selected route
              : ROUTE_WEIGHTS.ALTERNATIVE            // Normal for alternative routes
          }
          opacity={route.isActive ? 1 : 0.8}
          dashArray={route.isActive ? null : (route.isSelected ? null : '5, 5')}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent;