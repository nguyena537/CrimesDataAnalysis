import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './App.css';  // Import the CSS file

const cityLocations = {
  LA: [34.0522, -118.2437],
  Chicago: [41.8781, -87.6298],
  Austin: [30.2672, -97.7431],
  NYC: [40.7128, -74.0060],
  Philly: [39.9526, -75.1652]
};

function CityFilter({ onSelectCity }) {
  const handleChange = (event) => {
    const city = event.target.value;
    onSelectCity(city);
  };

  return (
    <div className="filter-container">
      <select onChange={handleChange}>
        <option value="">Select a city</option>
        <option value="LA">Los Angeles</option>
        <option value="Chicago">Chicago</option>
        <option value="Austin">Austin</option>
        <option value="NYC">New York City</option>
        <option value="Philly">Philadelphia</option>
      </select>
    </div>
  );
}

function MapWithMarkers({ crimeData, selectedCity }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCity && cityLocations[selectedCity]) {
      map.setView(cityLocations[selectedCity], 12);
    }
  }, [selectedCity, map]);

  return (
    <>
      {crimeData.map((crime, index) => (
        <Marker key={index} position={[crime.latitude, crime.longitude]}>
          <Popup>
            {crime.crime_description}<br />Zip Code: {crime.zipcode}
          </Popup>
        </Marker>
      ))}
    </>
  );
}

function App() {
  const [crimeData, setCrimeData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    axios.get('http://127.0.0.1:3001/data')
      .then(response => {
        setCrimeData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div>
      <header>
        <h1>CS179G: Crime Data Analysis</h1>
      </header>
      <CityFilter onSelectCity={setSelectedCity} />
      <MapContainer center={[37.7749, -122.4194]} zoom={5} id="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapWithMarkers crimeData={crimeData} selectedCity={selectedCity} />
      </MapContainer>
    </div>
  );
}

export default App;
