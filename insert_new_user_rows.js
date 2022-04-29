const mysql2 = require("mysql2");
const database = require("./database");

exports.insertRows = function (userID) {

    database.query("INSERT INTO liability_amounts(user_id) VALUES(?)", userID, function (err, result){
        if (err) throw err;
        console.log("result");
        console.log("1 record inserted");
    });
    
    database.query("INSERT INTO liability_interests(user_id) VALUES(?)", userID, function (err, result){
        if (err) throw err;
        console.log("result");
        console.log("1 record inserted");
    });

    database.query("INSERT INTO liability_interest_rates(user_id) VALUES(?)", userID, function (err, result){
        if (err) throw err;
        console.log("result");
        console.log("1 record inserted");
    });

    database.query("INSERT INTO liability_durations(user_id) VALUES(?)", userID, function (err, result){
        if (err) throw err;
        console.log("result");
        console.log("1 record inserted");
    });

    database.query("INSERT INTO liability_dates(user_id) VALUES(?)", userID, function (err, result){
        if (err) throw err;
        console.log("result");
        console.log("1 record inserted");
    });

} 


module.exports;