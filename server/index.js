const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db');

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

pool.getConnection(function (err, con) {
    if (err) throw err;
    console.log("Connected to MySQL database!");
});

app.get('/crimesForZipcode/:zipcode', (req, res) => {
    const zipcode = req.params.zipcode;
    const query = `
        SELECT crimeType, longitude, latitude, income FROM crimes
        WHERE zip_code = ${zipcode};
    `;
    pool.getConnection(function (err, con) {
        if (err) throw err;
        con.query(query, function (err, results) {
            if (err) throw err;
            const data = results.map(row => ({
                latitude: row.latitude,
                longitude: row.longitude,
                crime_description: row.crimeType
            }));
            res.json(data);
        });
    });
});

app.get('/mostCommonIncome/:city', (req, res) => {
    let city = req.params.city;

    if (city == "LA") {
        city = "Los Angeles";
    }
    else if (city == "NYC") {
        city = "New York City";
    }

    const query = `
        SELECT city, income_range, crime_count FROM mostCommonIncome
        WHERE city="${city}"
        ORDER BY crime_count DESC;
    `;
    pool.getConnection(function (err, con) {
        if (err) throw err;
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
});

app.get('/mostCommonCrimeByZipCode/:zipcode', (req, res) => {
    const zipcode = req.params.zipcode;
    const query = `
        SELECT * FROM mostCommonCrimeByZipCode
        WHERE zip_code = ${zipcode};`;

    pool.getConnection(function (err, con) {
        if (err) throw err;
        con.query(query, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
});

app.get('/crimeTime/:zipcode', (req, res) => {
    const zipcode = req.params.zipcode;
    const query = `
        SELECT city, income_range, crime_count FROM crimeTime
        WHERE zip_code="${zipcode}"
        ORDER BY crime_count DESC;
    `;
    pool.getConnection(function (err, con) {
        if (err) throw err;
        con.query(query, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
});

app.get('/cityStatistics/:city', (req, res) => {
    let city = req.params.city;

    if (city == "LA") {
        city = "Los Angeles";
    }
    else if (city == "NYC") {
        city = "New York City";
    }

    const query = `
        SELECT * FROM cityStatistics
        WHERE city="${city}";
    `;

    pool.getConnection(function (err, con) {
        if (err) throw err;
        con.query(query, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));