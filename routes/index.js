const router = require("express").Router();
require('dotenv').config();
const passport = require("passport");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const mysql2 = require("mysql2");
const flash = require("express-flash");
const https = require("https");
const { response } = require("express");
const bodyParser = require("body-parser");
const { appendFile } = require("fs");
const fs = require('fs');
const stream = require("stream");
const JSONStream = require('JSONStream');
const es = require('event-stream');
const request = require('request')
const fetch = require('node-fetch');
const path = require("path");

router.use(bodyParser.urlencoded({ extended: true, limit: "100kb" }))

// ***************************************************************************************

// ***************************************************************************************


const con = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

function isloggedin(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}



// ****************************     GET ROUTES    ********************************************************
router.get("/", function (req, res) {
    res.render("home");
})

router.get("/login", function (req, res) {
    res.render("login");
})

router.get("/signup", function (req, res) {
    res.render("signup");
})

router.get("/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
)

router.get('/auth/facebook',
    passport.authenticate('facebook'));


router.get("/google/callback",
    passport.authenticate("google", {
        successRedirect: "/complete",
        failureRedirect: "/auth/failure",
    })
);

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/failure' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/complete');
    });

router.get("/auth/failure", function (req, res) {
    res.send("Oops login failed");
})

router.get("/complete", isloggedin, function (req, res) {
    res.render("complete");
});

router.get("/logout", function (req, res) {
    req.logOut();
    req.session.destroy();
    res.redirect("/");
});

router.get("/terms_and_conditions", function (req, res) {
    res.render("terms_and_conditions");
});




// **************************** POST ROUTES *******************************************************
router.post("/login", passport.authenticate('local-signIn', {
    successRedirect: '/complete',
    failureRedirect: '/login',
    failureFlash: true
}),
    function (req, res) {
        // res.redirect("/complete");
    })


router.post("/signup", passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/signup',
    failureFlash: true
}),
    function (req, res) {
        console.log("i am signup page");
    }
)

router.get("/stocks", async function (req, res) {
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
            // const filePath = path.join(__dirname , "../views/stocks.ejs"); 
            // const html = ejs.renderFile(filePath, {list} , {async: true}, function(err,data ){
            //     console.log(data);
            //     res.send(data);
            // })
            // console.log(html);
            // res.send(html);
            
        }catch (error) {
            console.log(error);
        }
    }
    getdata();
    // const html = ejs.renderFile("stocks.ejs", {list} , {async:true});
    // res.send(html);
    res.render("stocks", {list});


})

router.get("/test", function (req, res) {
    res.render("test.ejs", { name: "shadab" });
})


module.exports = router;