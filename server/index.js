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
        WHERE zip_code = ${zipcode}
        LIMIT 1000;
    `;
    pool.getConnection(function (err, con) {
        if (err) throw err;
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
});

app.get('/mostCommonIncome', (req, res) => {
    const city = req.body.city;
    console.log(city);
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
  
app.listen(port, () => console.log(`Listening on port ${port}`));