const mysql2 = require("mysql2");

const con = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    decimalNumbers: true
});


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con;

// Saharsh Database Connection Begin
const mysql = require('mysql');

var connection = mysql.createConnection({
  host: '127.0.0.1',               // Replace with your host name
  user: 'root',                    // Replace with your database username
  password: 'password',            // Replace with your database password
  database: 'profile_page_schema', // Replace with your database Name
});

connection.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('MySQL Database is connected Successfully');
	}
});

module.exports = connection;
// Saharsh Database Connection End