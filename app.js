const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const passport = require("passport");
const ejs = require("ejs");
const session = require("express-session");
const mysql2 = require("mysql2");
require("./auth_facebook");
require("./auth_google");
require("./auth_local");
var routes = require("./routes");
const flash = require("express-flash");
const fetch = require("node-fetch");
const path = require("path");

const con = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});


con.connect(function (err) {
    if (err) throw err;
    // console.log("Connected!");
});


const app = express();


app.use(body_parser.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        // secure: true
    }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.set("view engine", "ejs");
app.use(express.static("public"));




// ALL ROUTES 
app.use(routes);




app.listen(3000, function () {
    console.log("Server is up and running on port 3000");
});
