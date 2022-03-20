var mysql = require('mysql');
var conn = mysql.createConnection({
  host: '127.0.0.1',        // Replace with your host name
  user: 'saharsh',             // Replace with your database username
  password: 'Mains1234$',     // Replace with your database password
  database: 'profile_page_schema', // Replace with your database Name
  insecureAuth : true
}); 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;