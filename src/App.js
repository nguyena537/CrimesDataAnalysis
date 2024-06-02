import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';
import 'leaflet-extra-markers/dist/js/leaflet.extra-markers.min.js';
import './App.css';
import axios from 'axios'; // Import axios
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Import Chart.js
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

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

function MapWithMarkers({ selectedCity }) {
  const map = useMap();

  useEffect(() => {
    if (selectedCity && cityLocations[selectedCity]) {
      map.setView(cityLocations[selectedCity], 12);
    }
  }, [selectedCity, map]);

  return null; // No markers for now
}

function CrimePlot({ data }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Crime Data Plot',
      },
    },
  };

  const labels = data.map(d => d.crimeType);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Crime Count',
        data: data.map(d => d.count),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return <Bar options={options} data={chartData} />;
}

function RacePlot({ data }) {
  const chartData = {
    labels: ['White', 'Black', 'Asian'],
    datasets: [
      {
        label: 'Race Percentage',
        data: [data.race_white, data.race_black, data.race_asian],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Race Percentage',
      },
    },
  };

  return <Pie options={options} data={chartData} />;
}

function IncomePlot({ data }) {
  const chartData = {
    labels: ['Income'],
    datasets: [
      {
        label: 'Income',
        data: [data.income],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income Data',
      },
    },
  };

  return <Bar options={options} data={chartData} />;
}

function App() {
  const [crimeData, setCrimeData] = useState([]);
  const [crimeTypeData, setCrimeTypeData] = useState([]);
  const [raceData, setRaceData] = useState({});
  const [incomeData, setIncomeData] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedZipcode, setSelectedZipcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedCity && selectedZipcode) {
      setLoading(true);
      
      axios.all([
        axios.get(`http://127.0.0.1:3000/crimesForZipcode/${selectedZipcode}`),
        axios.get(`http://127.0.0.1:3000/crimeTypesForZipcode/${selectedZipcode}`),
        axios.get(`http://127.0.0.1:3000/raceDataForZipcode/${selectedZipcode}`),
        axios.get(`http://127.0.0.1:3000/incomeDataForZipcode/${selectedZipcode}`)
      ])
      .then(axios.spread((crimesRes, crimeTypesRes, raceRes, incomeRes) => {
        console.log('API responses:', { crimesRes, crimeTypesRes, raceRes, incomeRes });
        setCrimeData(crimesRes.data);
        setCrimeTypeData(crimeTypesRes.data);
        setRaceData(raceRes.data);
        setIncomeData(incomeRes.data);
        setLoading(false);
      }))
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('There was an error fetching the data!');
        setLoading(false);
      });
    } else {
      setCrimeData([]);
      setCrimeTypeData([]);
      setRaceData({});
      setIncomeData({});
    }
  }, [selectedCity, selectedZipcode]);

  return (
    <div>
      <header>
        <h1>Crime Data Map</h1>
      </header>
      <CityFilter onSelectCity={setSelectedCity} />
      <ZipcodeInput city={selectedCity} onSubmitZipcode={setSelectedZipcode} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <MapContainer center={[37.7749, -122.4194]} zoom={5} id="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapWithMarkers selectedCity={selectedCity} />
      </MapContainer>
      {crimeTypeData.length > 0 && <CrimePlot data={crimeTypeData} />}
      {Object.keys(raceData).length > 0 && <RacePlot data={raceData} />}
      {Object.keys(incomeData).length > 0 && <IncomePlot data={incomeData} />}
    </div>
  );
}

export default App;
