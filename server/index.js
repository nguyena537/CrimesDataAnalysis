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
    con.release();
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
                con.release();
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
                con.release();
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

// // New route to get zipcodes with the highest percentage of each race and their most common crime
// app.get('/highestRacePercentage/:city', (req, res) => {
//     const city = req.params.city;
//     const query = `
//       SELECT zip_code, 
//              MAX(race_white) as max_white, 
//              MAX(race_black) as max_black, 
//              MAX(race_asian) as max_asian
//       FROM crimes
//       WHERE city = "${city}"
//       GROUP BY zip_code
//       ORDER BY max_white DESC, max_black DESC, max_asian DESC
//       LIMIT 1;
//     `;
  
//     pool.getConnection(function (err, con) {
//       if (err) throw err;
//       con.query(query, function (err, result) {
//         if (err) throw err;
        
//         const zipcodes = result.map(row => row.zip_code);
        
//         const crimeQuery = `
//           SELECT zip_code, crimeType, COUNT(crimeType) as count
//           FROM crimes
//           WHERE zip_code IN (${zipcodes.join(', ')})
//           GROUP BY zip_code, crimeType
//           ORDER BY count DESC
//           LIMIT 1;
//         `;
        
//         con.query(crimeQuery, function (err, crimeResult) {
//           if (err) throw err;
//           res.json(crimeResult);
//         });
//       });
//     });
//   });

app.get('/dataForZipcode/:zipcode', (req, res) => {
    try {
        const zipcode = req.params.zipcode;
        const query = `
            SELECT * FROM mostCommonCrimeByZipCode
            WHERE zip_code = ${zipcode};`;

        pool.getConnection(function (err, con) {
            if (err) throw err;
            con.query(query, function (err, result) {
                con.release();
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
                con.release();
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
                con.release();
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
                con.release();
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
                con.release();
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
                con.release();
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

app.get('/crimeTypesByCity/:city', (req, res) => {
    try {
        let city = req.params.city;

        if (city == "LA") {
            city = "Los Angeles";
        }
        else if (city == "NYC") {
            city = "New York City";
        }

        const query = `
            SELECT * FROM crimeTypesForCity
            WHERE city="${city}"
            ORDER BY crimeCount DESC
            LIMIT 80;
        `;

        pool.getConnection(function (err, con) {
            if (err) throw err;
            con.query(query, function (err, result) {
                con.release();
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

function exitHandler() {
    pool.end();
    process.exit();
}

// do something when app is closing
process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);

app.listen(port, () => console.log(`Listening on port ${port}`));
