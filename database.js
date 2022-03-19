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