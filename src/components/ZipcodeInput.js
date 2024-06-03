import React, { useState } from 'react';
import axios from 'axios'; // Import axios

export default function ZipcodeInput({ city, onSubmitZipcode, loading, setLoading, setCrimeData, setRaceData, setIncomeData, setCrimeTypeData, setError }) {
    const [zipcode, setZipcode] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        if (zipcode.length >= 5) {
            setError("");
            setLoading(true);
            setCrimeData([]);
            setRaceData({});
            setIncomeData({});
            setCrimeTypeData([]);
            onSubmitZipcode(zipcode);
            axios.all([
                axios.get(`http://127.0.0.1:3000/crimesForZipcode/${zipcode}`),
                axios.get(`http://127.0.0.1:3000/crimeTypesForZipcode/${zipcode}`),
                axios.get(`http://127.0.0.1:3000/dataForZipcode/${zipcode}`),
            ])
            .then(axios.spread((crimesRes, crimeTypesRes, zipcodeDataRes) => {
                console.log('API responses:', { crimesRes, crimeTypesRes, zipcodeDataRes});
                var zipcodeData = zipcodeDataRes.data;
                setCrimeData(crimesRes.data);
                setCrimeTypeData(crimeTypesRes.data);
                setRaceData({
                race_black: zipcodeData.race_black,
                race_white: zipcodeData.race_white,
                race_asian: zipcodeData.race_asian
                })
                setIncomeData({income: zipcodeData.income})
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
            <input
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            placeholder="Enter a zipcode"
            disabled={!city}
            />
            <button type="submit" disabled={!city || loading}>Submit</button>
        </form>
        </div>
    );
}