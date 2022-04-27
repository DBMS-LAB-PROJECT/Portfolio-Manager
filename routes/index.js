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
const fetch = require('node-fetch');
const path = require("path");
const database = require("../database");
const _ = require("lodash");
// const stream = require("stream");
// const JSONStream = require('JSONStream');
// const es = require('event-stream');
// const request = require('request');

router.use(bodyParser.urlencoded({ extended: false }))
// ***************************************************************************************

// ***************************************************************************************


const con = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

function isloggedin(req, res, next) {
    // console.log("islogged in is running")
    // console.log(req.user);
    req.user ? next() : res.redirect('/login');
}

database.query("use portfolio_manager");

// ****************************     GET ROUTES    ********************************************************
router.get("/", function (req, res) {
    console.log("home");
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
        successRedirect: "/dashboard",
        failureRedirect: "/auth/failure",
    })
);

router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/failure' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    });

router.get("/auth/failure", function (req, res) {
    res.send("Oops login failed");
})

router.get("/dashboard", isloggedin, function (req, res) {

    res.render("dashboard", { username: req.user.user_name });
});

router.get("/logout", function (req, res) {
    req.logOut();
    req.session.destroy();
    res.redirect("/");
});

router.get("/terms_and_conditions", function (req, res) {
    res.render("terms_and_conditions");
});

router.get("/liabilities", isloggedin, function (req, res) {

    let sql = "SELECT * FROM ((liability_amounts a INNER JOIN liability_interests b ON a.user_id = b.user_id) INNER JOIN liability_interest_rates c ON a.user_id = c.user_id) WHERE a.user_id  = ?";

    database.query(sql, req.user.user_id, function (err, result, fields) {

        let total_amount = result[0].car_loan_amount;
        total_amount += result[0].property_loan_amount;
        total_amount += result[0].educational_loan_amount;
        total_amount += result[0].home_loan_amount;
        total_amount += result[0].bills_payable_amount;
        total_amount += result[0].mortgage_payable_amount;
        total_amount += result[0].capital_leases_amount;
        total_amount += result[0].bank_account_overdrafts_amount;

        let total_interest = result[0].car_loan_interest;
        total_interest += result[0].property_loan_interest;
        total_interest += result[0].educational_loan_interest;
        total_interest += result[0].home_loan_interest;
        total_interest += result[0].bills_payable_interest;
        total_interest += result[0].mortgage_payable_interest;
        total_interest += result[0].capital_leases_interest;
        total_interest += result[0].bank_account_overdrafts_interest;

        if (err) throw err;
        res.render("liabilities", {
            liabilities: result,
            total_amount: total_amount,
            total_interest: total_interest
        });

    });

});

router.get("/liabilities/edit/:liability_type", isloggedin, function (req, res, next) {
    let type = req.params.liability_type;
    let liability_type = _.snakeCase(_.lowerCase(type));
    let amount = liability_type + "_amount";
    let interest = liability_type + "_interest";
    let rate = liability_type + "_rate";

    let sql = "SELECT a." + amount + ", b." + interest + ", c." + rate + " FROM ((liability_amounts a INNER JOIN liability_interests b ON a.user_id = b.user_id) INNER JOIN liability_interest_rates c ON a.user_id = c.user_id) WHERE a.user_id = ?";

    database.query(sql, req.user.user_id, function (err, result) {

        if (err) throw err;
        console.log(result);
        res.render("edit_liability", { liability_name: type, liability: result[0], amount: amount, rate: rate });

    });

});


// **************************** POST ROUTES *******************************************************
router.post("/login", passport.authenticate('local-signIn', {
    successRedirect: '/dashboard',
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


router.post("/liabilities/edit/:liability_type", function (req, res) {

    let type = req.params.liability_type;
    let liability_type = _.snakeCase(_.lowerCase(type));
    let amount = liability_type + "_amount";
    let interest = liability_type + "_interest";
    let rate = liability_type + "_rate";

    let r = req.body.interest_rate;
    let t = req.body.time_period;
    let p = req.body.amount;
    let int = ((p * r * t) / 100);

    let sql = "UPDATE liability_amounts a, liability_interests b, liability_interest_rates c SET a." + amount + " = ?, b." + interest + " = ?, c." + rate + " = ? WHERE a.user_id = b.user_id AND b.user_id = c.user_id AND a.user_id = ?";

    database.query(sql, [p, int, r, req.user.user_id], function (err, result) {

        if (err) throw err;
        console.log(result);

    });

    res.redirect("/liabilities");
});


router.get("/stocks", async function (req, res) {
    con.query("use portfolio_manager");
    // const user = req.user;
    // console.log("this is get test route------->" + user);
    res.render("stocks");
})

router.post("/stocks", async function (req, res) {
    let url_time_series = "https://api.twelvedata.com/time_series?apikey=" + process.env.API_KEY + "&interval=1min&outputsize=5&symbol=";
    let url_logo = "https://api.twelvedata.com/logo?apikey=" + process.env.API_KEY + "&symbol=";
    url_time_series += req.body.company_symbol;
    url_logo += req.body.company_symbol;
    const symbol = req.body.company_symbol;
    const name = req.body.company_name;
    const data = await fetch(url_time_series);
    const jsondata = await data.json();
    // const logo_response = await fetch(url_logo);
    // const logo_json = await logo_response.json();
    // const logo = logo_json.url; 
    res.render("company", { logo: "", name: name, exchange: jsondata.meta.exchange, symbol: symbol });
    // res.render("company", { logo: "", name: 'Apple Inc', exchange: 'NASDAQ', symbol: 'AAPL' });
    // res.render("company");
    // res.send(jsondata);
})

router.post("/stocks/add", function (req, res) {
    con.query("use portfolio_manager");
    // const user_id = req.user;
    const user_id = '113720373204677842542';
    // console.log(user_id);
    let companyName = req.body.companyName;
    console.log(companyName);
    let symbol = req.body.symbol;
    console.log(symbol);
    const quantity = req.body.quantity;
    console.log(quantity);
    const pricePerShare = req.body.pricePerShare;
    console.log(pricePerShare);
    const dateOfBuying = req.body.dateOfBuying;
    console.log(dateOfBuying);
    // console.log("this is post route------->" + user_id); 

    let sql = 'insert into stocks (user_id, quantity, symbol, price, buyDate, companyName) values(?,?,?,?,?,?)'
    con.query(sql, [user_id, quantity, symbol, pricePerShare, dateOfBuying, companyName], function (err) {
        if (err) console.log(err);
        else console.log('1 stock inserted');
    })
})

// router.post("/alreadyHaveSelectedStockButtonAdd", async function (req, res) {
//     con.query("use portfolio_manager");
//     const user_id = '113720373204677842542';
//     // const user_id = req.user;
//     let symbol = req.body.symbol;
//     // console.log(symbol);
//     const quantity = parseInt(req.body.quantity);
//     // console.log('quantity---->' + quantity);
//     const prevQuantity = parseInt(req.body.prevQuantity);
//     let sql = 'select * from stocks where symbol = ? and user_id = ?'

//     const newQuantity = prevQuantity + quantity;
//     // console.log('newQuantity---->' + newQuantity);
//     sql = 'update stocks set quantity = ? where symbol = ? and user_id = ?';
//     con.query(sql, [newQuantity, symbol, user_id], function (err) {
//         if (err) console.log(err);
//     })
//     res.sendStatus(200);
// })

// router.post("/alreadyHaveSelectedStockButtonUpdate", function (req, res) {
//     con.query("use portfolio_manager");
//     const user_id = '113720373204677842542';
//     // const user_id = req.user;
//     let symbol = req.body.symbol;
//     // console.log(symbol);
//     const quantity = req.body.quantity;
//     // console.log('quantity---->' + quantity);
//     let sql = 'select * from stocks where symbol = ? and user_id = ?'
//     const newQuantity = parseInt(quantity);
//     // console.log(newQuantity);

//     sql = 'update stocks set quantity = ? where symbol = ? and user_id = ?';
//     con.query(sql, [newQuantity, symbol, user_id], function (err) {
//         if (err) console.log(err);
//     })
//     res.sendStatus(200);
// })

router.post('/currentHoldingModal', function (req, res) {
    con.query("use portfolio_manager");
    // const user_id = req.user;
    const user_id = '113720373204677842542';
    // console.log(user_id);
    let symbol = req.body.symbol;
    // console.log(symbol);
    // console.log("this is post route------->" + user_id); 
    let sql = 'select stock_id,quantity,symbol,price,buyDate from stocks where symbol = ? and user_id = ?'
    con.query(sql, [symbol, user_id], function (err, rows) {
        if (err) console.log(err);
        // console.log(rows);
        if (rows.length == 0) {
            res.send(rows);
        }
        else {
            res.send(rows);
        }
    })
})

router.post('/currentHoldingModal/remove', function (req, res) {
    con.query("use portfolio_manager");
    // const user_id = req.user;
    const user_id = '113720373204677842542';
    // console.log(user_id);
    let symbol = req.body.symbol;
    let stock_id = req.body.stock_id;
    // console.log(symbol);
    // console.log("this is post route------->" + user_id); 
    let sql = 'delete from stocks where symbol = ? and user_id = ? and stock_id = ?'
    con.query(sql, [symbol, user_id, stock_id], function (err, rows) {
        if (err) console.log(err);
        // console.log(rows);
        res.sendStatus(200);
    })
})

router.get('/about', (req, res) => {
    res.render('about');
})

router.get('/contact', (req, res) => {
    res.render('contact');
})

router.get('/currentHoldings', (req, res) => {
    con.query('use portfolio_manager');
    // const user_id = req.user;
    const user_id = '113720373204677842542';
    let userName;
    let sql = 'select user_name from login_credentials where user_id = ?';
    con.query(sql, user_id, function(err, rows){
        if(err) console.log(err);
        // console.log(rows);
        res.render('currentHoldings', {userName : rows[0].user_name});
        // userName = rows[0].user_name;
        console.log(userName);
    })
})

router.post('/currentHoldings', function (req, res) {
    con.query('use portfolio_manager');
    // const user_id = req.user;
    const user_id = '113720373204677842542';
    // console.log("this is post route------->" + user_id); 
    let sql = 'select stock_id,quantity,symbol,price,buyDate,companyName from stocks where user_id = ?'
    con.query(sql, user_id, function (err, rows) {
        if (err) console.log(err);
        // console.log(rows);
        if (rows.length == 0) {
            res.send(rows);
        }
        else {
            res.send(rows);
        }
    })
})

router.post('/currentHoldings/remove', function (req, res) {
    con.query("use portfolio_manager");
    // const user_id = req.user;
    const user_id = '113720373204677842542';
    // console.log(user_id);
    // let symbol = req.body.symbol;
    let stock_id = req.body.stock_id;
    // console.log(symbol);
    // console.log("this is post route------->" + user_id); 
    let sql = 'delete from stocks where user_id = ? and stock_id = ?'
    con.query(sql, [user_id, stock_id], function (err, rows) {
        if (err) console.log(err);
        // console.log(rows);
        res.sendStatus(200);
    })
})

router.post('/currentHoldings/search', (req, res) => {
    con.query("use portfolio_manager");
    // const user_id = req.user;
    const user_id = '113720373204677842542';
    const searchItem = req.body.searchItem;
    // console.log(searchItem);
    // console.log("this is post route------->" + user_id); 
    let sql = "select stock_id,quantity,symbol,price,buyDate,companyName from stocks where symbol   like '%" + searchItem + "%' or companyName like '%" + searchItem + "%' and user_id = '" + user_id + "'"; 
    con.query(sql, [searchItem, searchItem, user_id], function (err, rows) {
        if (err) console.log(err);
        // console.log(rows);
        if (rows.length == 0) {
            res.send(rows);
        }
        else {
            res.send(rows);
        }
    })
})

router.post('/getAllCompanies', async (req, res) => {
    let url = "https://api.twelvedata.com/stocks?apikey=" + process.env.API_KEY + "&country=usa";
    const data = await fetch(url);
    const jsondata = await data.json();
    // console.log(jsondata);
    res.send(jsondata);
})

router.post('/url_time_series', async (req, res) => {
    const symbol = req.body.symbol;
    const interval = req.body.interval
    const API_KEY = process.env.API_KEY;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;

    const url_time_series = "https://api.twelvedata.com/time_series?apikey=" + API_KEY + "&interval=" + interval + "&symbol=" + symbol + "&end_date=" + end_date + "&start_date=" + start_date;
    const data = await fetch(url_time_series);
    const jsondata = await data.json();
    // console.log(jsondata);
    res.send(jsondata);
})

router.post('/info', async (req, res) => {
    const symbol = req.body.symbol;
    let url = 'https://api.polygon.io/v3/reference/tickers/' + symbol + '?apiKey=' + process.env.polygonAPI1;
    const data = await fetch(url);
    const jsondata = await data.json();
    // console.log(jsondata);
    res.send(jsondata);
})

router.post('/stockSplitHistory', async(req,res) => {
    const symbol = req.body.symbol;
    const url = 'https://api.polygon.io/v3/reference/splits?ticker=' + symbol + '&apiKey=' + process.env.polygonAPI1;
    const data = await fetch(url);
    const jsondata = await data.json();
    // console.log(jsondata);
    res.send(jsondata);
})

router.post('/dividendHistory', async(req,res) => {
    const symbol = req.body.symbol;
    let url = req.body.url;
    url += process.env.polygonAPI3;
    const data = await fetch(url);
    const jsondata = await data.json();
    // console.log(jsondata);
    res.send(jsondata);
})

module.exports = router;