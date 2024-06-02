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
        WHERE zip_code = ${zipcode};`;
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

app.get('/raceDataForZipcode/:zipcode', (req, res) => {
    const zipcode = req.params.zipcode;
    const query = `
      SELECT race_white, race_black, race_asian FROM crimes
      WHERE zip_code = ${zipcode} LIMIT 1;
    `;
    pool.getConnection(function (err, con) {
      if (err) throw err;
      con.query(query, function (err, result) {
        if (err) throw err;
        res.json(result[0]);
      });
    });
  });

// New route to get zipcodes with the highest percentage of each race and their most common crime
app.get('/highestRacePercentage/:city', (req, res) => {
    const city = req.params.city;
    const query = `
      SELECT zip_code, 
             MAX(race_white) as max_white, 
             MAX(race_black) as max_black, 
             MAX(race_asian) as max_asian
      FROM crimes
      WHERE city = "${city}"
      GROUP BY zip_code
      ORDER BY max_white DESC, max_black DESC, max_asian DESC
      LIMIT 1;
    `;
  
    pool.getConnection(function (err, con) {
      if (err) throw err;
      con.query(query, function (err, result) {
        if (err) throw err;
        
        const zipcodes = result.map(row => row.zip_code);
        
        const crimeQuery = `
          SELECT zip_code, crimeType, COUNT(crimeType) as count
          FROM crimes
          WHERE zip_code IN (${zipcodes.join(', ')})
          GROUP BY zip_code, crimeType
          ORDER BY count DESC
          LIMIT 1;
        `;
        
        con.query(crimeQuery, function (err, crimeResult) {
          if (err) throw err;
          res.json(crimeResult);
        });
      });
    });
  });

  app.get('/crimeTypesForZipcode/:zipcode', (req, res) => {
    const zipcode = req.params.zipcode;
    const query = `
        SELECT crimeType, COUNT(crimeType) as count FROM crimes
        WHERE zip_code = ${zipcode}
        GROUP BY crimeType;`;
    pool.getConnection(function (err, con) {
        if (err) throw err;
        con.query(query, function (err, results) {
            if (err) throw err;
            res.json(results);
        });
    });
});

app.get('/incomeDataForZipcode/:zipcode', (req, res) => {
    const zipcode = req.params.zipcode;
    const query = `
      SELECT income FROM crimes
      WHERE zip_code = ${zipcode} LIMIT 1;`;
    pool.getConnection(function (err, con) {
      if (err) throw err;
      con.query(query, function (err, result) {
        if (err) throw err;
        res.json(result[0]);
      });
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
