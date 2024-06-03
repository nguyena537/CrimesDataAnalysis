import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

export default function MapWithMarkers({ crimeData, selectedCity, selectedZipcode }) {
    const map = useMap();
    const cityLocations = {
        LA: [34.0522, -118.2437],
        Chicago: [41.8781, -87.6298],
        Austin: [30.2672, -97.7431],
        NYC: [40.7128, -74.0060],
        Philly: [39.9526, -75.1652]
    };
    useEffect(() => {
      if (selectedCity && cityLocations[selectedCity]) {
        map.setView(cityLocations[selectedCity], 12);
      }
    }, [selectedCity, map]);
  
    useEffect(() => {
      console.log('Crime data for markers:', crimeData);  // Add this line to check crime data
    }, [crimeData]);
  
    return (
      <>
        {crimeData.map((crime, index) => {
          const position = [crime.latitude, crime.longitude];
          if (isNaN(position[0]) || isNaN(position[1])) {
            console.warn(`Invalid coordinates for crime at index ${index}:`, position);
            return null;
          }
          console.log(`Adding marker at ${position} for crime: ${crime.crime_description}`);
          return (
            <Marker key={index} position={position}>
              <Popup>
                {crime.crime_description}<br />Zip Code: {crime.zipcode}
              </Popup>
            </Marker>
          );
        })}
      </>
    );
  }