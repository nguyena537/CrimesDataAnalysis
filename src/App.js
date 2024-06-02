import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import './App.css';

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

function ZipcodeInput({ city, onSubmitZipcode }) {
  const [zipcode, setZipcode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (zipcode) {
      onSubmitZipcode(zipcode);
    }
  };

  return (
    <div className="filter-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
          placeholder="Enter a zipcode"
          disabled={!city}
        />
        <button type="submit" disabled={!city}>Submit</button>
      </form>
    </div>
  );
}

function MapWithMarkers({ crimeData, selectedCity, selectedZipcode }) {
  const map = useMap();

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

function App() {
  const [crimeData, setCrimeData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZipcode, setSelectedZipcode] = useState("");

  useEffect(() => {
    if (selectedCity && selectedZipcode) {
      axios.get(`http://127.0.0.1:3000/crimesForZipcode/${selectedZipcode}`)
        .then(response => {
          console.log('Fetched data:', response.data);  // Add this line
          setCrimeData(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the data!', error);
        });
    } else {
      setCrimeData([]);
    }
  }, [selectedCity, selectedZipcode]);

  return (
    <div>
      <header>
        <h1>Crime Data Map</h1>
      </header>
      <CityFilter onSelectCity={setSelectedCity} />
      <ZipcodeInput city={selectedCity} onSubmitZipcode={setSelectedZipcode} />
      <MapContainer center={[37.7749, -122.4194]} zoom={5} id="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapWithMarkers crimeData={crimeData} selectedCity={selectedCity} selectedZipcode={selectedZipcode} />
      </MapContainer>
    </div>
  );
}

export default App;
