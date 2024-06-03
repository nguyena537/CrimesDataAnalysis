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
    try {
        const zipcode = req.params.zipcode;
        const query = `
            WITH RankedCrimes AS (
                SELECT crimeType, latitude, longitude, date, time,
                    ROW_NUMBER() OVER (PARTITION BY latitude, longitude ORDER BY crimeType) AS rn
                FROM crimes
                WHERE zip_code = ${zipcode}
            )
            SELECT crimeType, latitude, longitude, date, time
            FROM RankedCrimes
            WHERE rn = 1
            LIMIT 1000;
        `;
        pool.getConnection(function (err, con) {
            if (err) throw err;
            con.query(query, function (err, results) {
                if (err) throw err;
                const data = results.map(row => ({
                    latitude: row.latitude,
                    longitude: row.longitude,
                    crime_description: row.crimeType,
                    time: row.time,
                    date: row.date
                }));
                res.json(data);
            });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    
});

app.get('/mostCommonIncome/:city', (req, res) => {
    try {
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
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get('/dataForZipcode/:zipcode', (req, res) => {
    try {
        const zipcode = req.params.zipcode;
        const query = `
            SELECT * FROM mostCommonCrimeByZipCode
            WHERE zip_code = ${zipcode};`;

        pool.getConnection(function (err, con) {
            if (err) throw err;
            con.query(query, function (err, result) {
                if (err) throw err;
                res.json(result[0]);
            });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get('/crimeTime/:zipcode', (req, res) => {
    try {
        const zipcode = req.params.zipcode;
        const query = `
            SELECT * FROM crimeTime
            WHERE zip_code="${zipcode}";
        `;
        pool.getConnection(function (err, con) {
            if (err) throw err;
            con.query(query, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get('/cityStatistics/:city', (req, res) => {
    try {
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
                res.json(result[0]);
            });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get('/crimeTypesForZipcode/:zipcode', (req, res) => {
    try {
        const zipcode = req.params.zipcode;
        const query = `
            SELECT crimeType, crimeCount FROM crimeTypesForZipcode
            WHERE zip_code = ${zipcode}
            ORDER BY crimeCount DESC`;
        pool.getConnection(function (err, con) {
            if (err) throw err;
            con.query(query, function (err, results) {
                if (err) throw err;
                res.json(results);
            });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

app.get('/zipcodesForCity/:city', (req, res) => {
    try {
        let city = req.params.city;

        if (city == "LA") {
            city = "Los Angeles";
        }
        else if (city == "NYC") {
            city = "New York City";
        }

        const query = `
            SELECT zip_code FROM mostCommonCrimeByZipCode
            WHERE city="${city}"
            ORDER BY zip_code ASC;
        `;

        pool.getConnection(function (err, con) {
            if (err) throw err;
            con.query(query, function (err, result) {
                if (err) throw err;
                res.json(result.map(z => z.zip_code));
            });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    
});

app.get('/crimesOverTime/:zipcode', (req, res) => {
    try {
        let zipcode = req.params.zipcode;

        const query = `
            SELECT year, crimeCount FROM crimesOverTime
            WHERE zip_code="${zipcode}"
            ORDER BY year ASC;
        `;

        pool.getConnection(function (err, con) {
            if (err) throw err;
            con.query(query, function (err, result) {
                if (err) throw err;
                res.json(result);
            });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
    
});

app.listen(port, () => console.log(`Listening on port ${port}`));
