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

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 * 60 * 24
    }
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.set("view engine", "ejs");
app.use(express.static("public"));


app.engine('ejs', async (path, data, cb) => {
    try{
        let html = await ejs.renderFile(path, data, {async: true});
        cb(null, html);
    }catch (e){
        cb(e, '');
    }
});

// ALL ROUTES 
app.use(routes);


app.get("/stocks", async function (req, res) {
    let url_stocks = "https://api.twelvedata.com/stocks?apikey=" + process.env.API_KEY + "&country=usa";
    let url_time_series = "https://api.twelvedata.com/time_series?apikey=" + process.env.API_KEY + "&interval=1min&outputsize=1&symbol=";

    const list = [];
    async function getdata() {
        try {
            const data = await fetch(url_stocks);
            const obj_data = await data.json();

            const obj_array = obj_data.data;


            const stockprice = await fetch(url_time_series);

            // res.send(stockprice);
            // console.log(url_time_series);
            // res.send(url_time_series);


            let symbol, name, currency, exchange, country, type;
            let obj = {
                symbol: symbol,
                name: name,
                currency: currency,
                exchange: exchange,
                country: country,
                type: type
            }

            // add the whole data to list array 
            obj_array.forEach(company => {
                // res.write(company.symbol + "\t" + company.name + "\t" + company.currency + "\t" + company.exchange + "\t" + company.country + "\t" + company.type + "\n");
                let newobj = {
                symbol:  company.symbol,
                name:  company.name,
                currency:  company.currency,
                exchange:  company.exchange,
                country:  company.country,
                type:  company.type
                }
                list.push(newobj);
                // res.write(obj.symbol + " " + obj.name + "\n");
            });




            // res.send(list);
            const filePath = path.join(__dirname , "../views/stocks.ejs"); 
            const html = ejs.renderFile(filePath, {list} , {async: true}, function(err,data ){
                // console.log(data);

            })
            // console.log(html);
            res.send(html);
            

        } catch (error) {
            console.log(error);
        }

    }

    getdata()
    // const html = ejs.renderFile("stocks.ejs", {list} , {async:true});
    // res.send(html);
    // res.render("stocks", {list});


})

app.listen(3000, function () {
    console.log("Server is up and running on port 3000");
});
