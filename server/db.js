var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "MyNewPass",
  database: "crimesdb"
});

con.connect(function(err) {
  if (err) throw err;
  if (err) throw err;
  con.query("SELECT * FROM crimes LIMIT 10", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});