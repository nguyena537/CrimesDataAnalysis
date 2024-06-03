import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'leaflet-extra-markers/dist/js/leaflet.extra-markers.min.js';
import './App.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import IncomePlot from './components/IncomePlot.js';
import RacePlot from './components/RacePlot.js';
import CrimePlot from './components/CrimePlot.js';
import CrimeOverTimePlot from './components/CrimeOverTimePlot.js';
import CrimeTimeOfDayPlot from './components/CrimeTimeOfDayPlot.js';
import ZipcodeInput from './components/ZipcodeInput.js';
import MapWithMarkers from './components/MapWithMarkers.js';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

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

function App() {
  const [crimeData, setCrimeData] = useState([]);
  const [crimeTypeData, setCrimeTypeData] = useState([]);
  const [raceData, setRaceData] = useState({});
  const [incomeData, setIncomeData] = useState({});
  const [cityData, setCityData] = useState(null);
  const [crimeTimeData, setCrimeTimeData] = useState([]);
  const [crimeOverTimeData, setCrimeOverTimeData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZipcode, setSelectedZipcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedCity) {
      setLoading(true);
      setError(null);
      fetch(`http://localhost:3000/cityStatistics/${selectedCity}`)
        .then(response => response.json())
        .then(data => {
          setCityData(data);
          setLoading(false);
        })
        .catch(error => {
          setError('Error fetching city statistics');
          setLoading(false);
        });
    }
  }, [selectedCity]);

  return (
    <div className="App">
      <header>
        <h1>Crime Data Visualized</h1>
      </header>
      <CityFilter onSelectCity={setSelectedCity} />
      <ZipcodeInput 
        city={selectedCity} 
        onSubmitZipcode={setSelectedZipcode} 
        loading={loading}
        setLoading={setLoading}
        setCrimeData={setCrimeData}
        setRaceData={setRaceData}
        setIncomeData={setIncomeData}
        setCrimeTypeData={setCrimeTypeData}
        setCrimeTimeData={setCrimeTimeData}
        setCrimeOverTimeData={setCrimeOverTimeData}
        setError={setError}
      />
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      <MapContainer center={[37.7749, -122.4194]} zoom={5} id="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapWithMarkers crimeData={crimeData} selectedCity={selectedCity} selectedZipcode={selectedZipcode} />
      </MapContainer>
      <div className="plot-container">
        {crimeTypeData.length > 0 && (
          <div className="plot-card">
            <CrimePlot data={crimeTypeData} />
          </div>
        )}
        {Object.keys(raceData).length > 0 && (
          <div className="plot-card">
            <RacePlot data={raceData} />
          </div>
        )}
        {Object.keys(incomeData).length > 0 && cityData && (
          <div className="plot-card">
            <IncomePlot data={{ ...incomeData, avg_income: cityData.avg_income }} />
          </div>
        )}
        {Object.keys(crimeOverTimeData).length > 0 && (
          <div className="plot-card">
            <CrimeOverTimePlot data={crimeOverTimeData} />
          </div>
        )}
        {crimeTimeData.length > 0 && (
          <div className="plot-card">
            <CrimeTimeOfDayPlot data={crimeTimeData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
