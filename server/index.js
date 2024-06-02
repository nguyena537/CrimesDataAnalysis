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

// con.connect(err => {
//     if (err) throw err;
//     console.log('Connected to MySQL database.');
// });

// app.get('/data/:zipcode', (req, res) => {
//     const city = req.params.city;
//     const zipcode = req.params.zipcode;
//     const sql = `
//       SELECT latitude, longitude, zip_code, crimeType 
//       FROM crimes 
//       WHERE city = ? AND zipcode = ?`;
  
//     con.query(sql, [city, zipcode], (err, results) => {
//       if (err) throw err;
//       const data = results.map(row => ({
//         latitude: row.latitude,
//         longitude: row.longitude,
//         zipcode: row.zip_code,
//         crime_description: row.crimeType
//       }));
//       res.json(data);
//     });
//   });

app.listen(port, () => console.log(`Listening on port ${port}`));