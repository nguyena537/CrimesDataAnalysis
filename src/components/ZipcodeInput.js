import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrimeTypesPlot from './CrimeTypesPlot'; // Import the new plotting component

export default function ZipcodeInput({ city, onSubmitZipcode, loading, setLoading, setCrimeData, setRaceData, setIncomeData, setCrimeTypeData, setCrimeTimeData, setCrimeOverTimeData, setCityData, setError, setCrimesVsIncomeData, zipcodes }) {
    const [zipcode, setZipcode] = useState("");
    const [crimeTypesByCityData, setCrimeTypesByCityData] = useState([]); // New state for crime types by city

    useEffect(() => {
        if (city) {
            setLoading(true);
            axios.get(`http://127.0.0.1:3000/crimeTypesByCity/${city}`)
                .then(response => {
                    setCrimeTypesByCityData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching crime types by city:', error);
                    setError('There was an error fetching the crime types!');
                    setLoading(false);
                });
        }
    }, [city]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (zipcode) {
            setError("");
            setLoading(true);
            setCrimeData([]);
            setRaceData({});
            setIncomeData({});
            setCrimeTypeData([]);
            setCrimeTimeData([]);
            onSubmitZipcode(zipcode);
            axios.all([
                axios.get(`http://127.0.0.1:3000/crimesForZipcode/${zipcode}`),
                axios.get(`http://127.0.0.1:3000/crimeTypesForZipcode/${zipcode}`),
                axios.get(`http://127.0.0.1:3000/dataForZipcode/${zipcode}`),
                axios.get(`http://127.0.0.1:3000/crimeTime/${zipcode}`),
                axios.get(`http://127.0.0.1:3000/crimesOverTime/${zipcode}`)
            ])
            .then(axios.spread((crimesRes, crimeTypesRes, zipcodeDataRes, crimeTimeRes, crimeOverTimeRes) => {
                console.log('API responses:', { crimesRes, crimeTypesRes, zipcodeDataRes, crimeTimeRes, crimeOverTimeRes });
                var zipcodeData = zipcodeDataRes.data;
                setCrimeData(crimesRes.data);
                setCrimeTypeData(crimeTypesRes.data);
                setRaceData({
                  race_black: zipcodeData.race_black,
                  race_white: zipcodeData.race_white,
                  race_asian: zipcodeData.race_asian
                });
                setIncomeData({ income: zipcodeData.income });
                setCrimeTimeData(crimeTimeRes.data);

                const crimeOverTimeData = crimeOverTimeRes.data.reduce((acc, curr) => {
                    acc[curr.year] = curr.crimeCount;
                    return acc;
                }, {});
                console.log('Crime Over Time:', crimeOverTimeData);
                setCrimeOverTimeData(crimeOverTimeData);
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
    };

    return (
        <div className="filter-container">
            <form onSubmit={handleSubmit}>
                <select
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value)}
                    disabled={!city}
                >
                    <option value="">Select a zipcode</option>
                    {zipcodes.map((zip) => (
                        <option key={zip} value={zip}>
                            {zip}
                        </option>
                    ))}
                </select>
                <button type="submit" disabled={!city || loading}>Submit</button>
            </form>
            {crimeTypesByCityData.length > 0 && (
                <div className="chart-wrapper">
                    <div className="chart-title">Most Common Crimes in {city}</div>
                    <CrimeTypesPlot data={crimeTypesByCityData} />
                </div>
            )}
        </div>
    );
}
