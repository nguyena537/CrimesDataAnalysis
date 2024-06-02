const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const con = require('./db')

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/crimesForZipcode/:zipcode', (req, res) => {
    const zipcode = req.params.zipcode;
    const query = `
        SELECT crimeType, longitude, latitude, income FROM crimes
        WHERE zip_code = ${zipcode}
        LIMIT 1000;
    `;
    con.connect(function(err) {
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
    con.connect(function(err) {
        if (err) throw err;
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            res.json(result);
        });
    });
});

con.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

app.get('/data', (req, res) => {
    const sql = 'SELECT latitude, longitude, zipcode, crime_description FROM crimes';
    con.query(sql, (err, results) => {
      if (err) throw err;
      const data = results.map(row => ({
        latitude: row.latitude,
        longitude: row.longitude,
        zipcode: row.zipcode,
        crime_description: row.crime_description
      }));
      res.json(data);
    });
  });
  
app.listen(port, () => console.log(`Listening on port ${port}`));