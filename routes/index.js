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
    async function getdata() {
        try {
            const list = [];
            const data = await fetch(url_stocks);
            const obj_data = await data.json();
            const obj_array = obj_data.data;

            // add the whole data to list array 
            obj_array.forEach(company => {
                let newobj = {
                    symbol: company.symbol,
                    name: company.name,
                    currency: company.currency,
                    exchange: company.exchange,
                    country: company.country,
                    type: company.type
                }
                list.push(newobj);
            });
            const filePath = path.join(__dirname, "../views/stocks.ejs");
            const html = ejs.renderFile(filePath, { list }, { async: true }, function (err, data) {
                Promise.resolve(data).then(value => res.send(value));
            })
        } catch (error) {
            console.log(error);
        }
    }
    getdata();



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
    // res.send(jsondata);
})

router.get("/test", async function (req, res) {
    con.query("use portfolio_manager");
    // const user = req.user;
    // console.log("this is get test route------->" + user);
    res.render("test");
})

router.post("/add", function (req, res) {
    con.query("use portfolio_manager");
    // const user_id = req.user;
    const user_id = '113720373204677842542';
    // console.log(user_id);
    let symbol = req.body.symbol;
    // console.log(symbol);
    const quantity = req.body.quantity;
    // console.log(quantity);
    // console.log("this is post route------->" + user_id); 
    let sql = 'select * from stocks where symbol = ? and user_id = ?'
    con.query(sql, [symbol, user_id], function (err, rows) {
        if (err) console.log(err);
        if (rows.length === 0) {
            let sql = 'insert into stocks (user_id, quantity, symbol) values(?,?,?)'
            con.query(sql, [user_id, quantity, symbol], function (err) {
                if (err) console.log(err);
                else console.log('1 stock inserted');
            })

            res.send({ prevQuantity: 0 });
        }
        else {
            const prevQuantity = rows[0].quantity;
            res.send({ prevQuantity: prevQuantity });
        }
    })
})

router.post("/alreadyHaveSelectedStockButtonAdd", async function (req, res) {
    con.query("use portfolio_manager");
    const user_id = '113720373204677842542';
    // const user_id = req.user;
    let symbol = req.body.symbol;
    // console.log(symbol);
    const quantity = parseInt(req.body.quantity);
    // console.log('quantity---->' + quantity);
    const prevQuantity = parseInt(req.body.prevQuantity);
    let sql = 'select * from stocks where symbol = ? and user_id = ?'

    const newQuantity = prevQuantity + quantity;
    // console.log('newQuantity---->' + newQuantity);
    sql = 'update stocks set quantity = ? where symbol = ? and user_id = ?';
    con.query(sql, [newQuantity, symbol, user_id], function (err) {
        if (err) console.log(err);
    })
    res.sendStatus(200);
})

router.post("/alreadyHaveSelectedStockButtonUpdate", function (req, res) {
    con.query("use portfolio_manager");
    const user_id = '113720373204677842542';
    // const user_id = req.user;
    let symbol = req.body.symbol;
    // console.log(symbol);
    const quantity = req.body.quantity;
    // console.log('quantity---->' + quantity);
    let sql = 'select * from stocks where symbol = ? and user_id = ?'
    const newQuantity = parseInt(quantity);
    // console.log(newQuantity);

    sql = 'update stocks set quantity = ? where symbol = ? and user_id = ?';
    con.query(sql, [newQuantity, symbol, user_id], function (err) {
        if (err) console.log(err);
    })
    res.sendStatus(200);
})

router.post('/currentHolding', function (req, res) {
    con.query("use portfolio_manager");
    // const user_id = req.user;
    const user_id = '113720373204677842542';
    // console.log(user_id);
    let symbol = req.body.symbol;
    // console.log(symbol);
    // console.log("this is post route------->" + user_id); 
    let sql = 'select * from stocks where symbol = ? and user_id = ?'
    con.query(sql, [symbol, user_id], function (err, rows) {
        if (err) console.log(err);
        if(rows.length == 0){
            res.send({ prevQuantity: 0 });
        }
        else{
            res.send({prevQuantity: rows[0].quantity})
        }
    })
})



module.exports = router;