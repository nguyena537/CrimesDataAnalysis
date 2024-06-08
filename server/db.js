var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit : 20,
  host            : '127.0.0.1',
  user            : 'root',
  password        : 'MyNewPass',
  database        : 'crimesdb'
});

module.exports = pool;