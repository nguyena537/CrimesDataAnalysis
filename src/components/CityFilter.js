import React from 'react';
import axios from 'axios';

export default function CityFilter({ onSelectCity, setLoading, setCityData, setZipcodes, setCrimesVsIncomeData, setError }) {
    const handleChange = (event) => {
      const city = event.target.value;
      onSelectCity(city);
      setLoading(true);
      axios.get(`http://127.0.0.1:3000/cityStatistics/${city}`)
          .then(response => {
              setCityData(response.data);
              setLoading(false);
          })
          .catch(error => {
              console.error('Error fetching city statistics:', error);
              setError('There was an error fetching the city statistics!');
              setLoading(false);
          });
  
      axios.get(`http://127.0.0.1:3000/zipcodesForCity/${city}`)
          .then(response => {
              setZipcodes(response.data);
          })
          .catch(error => {
              console.error('Error fetching zip codes:', error);
              setError('There was an error fetching the zip codes!');
          });
  
      axios.get(`http://127.0.0.1:3000/mostCommonIncome/${city}`)
          .then(response => {
              setCrimesVsIncomeData(response.data);
              setLoading(false);
          })
          .catch(error => {
              console.error('Error fetching mostCommonIncome:', error);
              setError('There was an error fetching the mostCommonIncome!');
              setLoading(false);
          });
    };
  
    return (
      <div className="filter-container">
        <select onChange={handleChange}>
          <option value="">Select a city</option>
          <option value="LA">Los Angeles</option>
          <option value="Chicago">Chicago</option>
          <option value="Austin">Austin</option>
          <option value="NYC">New York City</option>
          <option value="Philadelphia">Philadelphia</option>
        </select>
      </div>
    );
  }