const router = require("express").Router();
require('dotenv').config();
const passport = require("passport");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const mysql2 = require("mysql2");
const mysql2promise = require('mysql2/promise');
const flash = require("express-flash");
const https = require("https");
const { response } = require("express");
const bodyParser = require("body-parser");
const { appendFile } = require("fs");
const fs = require('fs');
const fetch = require('node-fetch');
const path = require("path");
const database = require("../database");
const liabilities = require("../liabilities_queries");
const _ = require("lodash");
const { toArray, reject } = require("lodash");
const { resolve } = require("path");
const { promise } = require("../database");
const { promisify } = require('util');
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
    // console.log("home");
    res.render("home2");
})

router.get("/login", function (req, res) {
    res.render("login");
})
router.get("/login2", function (req, res) {
    res.render("login2");
})

router.get("/signup", function (req, res) {
    res.render("signup");
})
router.get("/signup2", function (req, res) {
    res.render("signup2");
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

// router.get("/dashboard", isloggedin, function (req, res) {
//     con.query('use portfolio_manager');
//     // const user_id = req.user;
//     // // const user_id = '113720373204677842542';
//     // let userName;
//     // let sql = 'select user_name from login_credentials where user_id = ?';
//     // con.query(sql, user_id, function (err, rows) {
//     //     if (err) console.log(err);
//     //     // console.log(rows);
//     //     res.render("dashboard", { username: rows[0].user_name });
//     //     // userName = rows[0].user_name;
//     //     console.log(userName);
//     // })
//     res.render('dashboard2');


// });


router.get('/dashboard', (req, res) => {
    res.render('dashboard2.ejs');
})

router.get("/logout", function (req, res) {
    req.logOut();
    req.session.destroy();
    res.redirect("/");
});

router.get("/terms_and_conditions", function (req, res) {
    res.render("terms_and_conditions");
});

router.get("/liabilities", isloggedin, function (req, res) {

    liabilities.liabilityData(req.user).then(result => {

        res.render("liabilities", {
            income_expense: result[0],
            liabilities: result[1],
            total_amount: result[2],
            total_interest: result[3],
        });

    }).catch(error => {
        console.log('error:', error);
    });

});

router.get("/getLiabilityNames.json", isloggedin, function (req, res) {

    liabilities.liabilityData(req.user).then(result => {

        res.json({ liabilities: result[1] });

    }).catch(error => {
        console.log('error:', error);
    });

});

router.get("/getMonthlyIncomeExpense.json", isloggedin, function (req, res) {

    liabilities.getMonthlyIn_Ex(req.user).then(result => {
        res.json(result);
    });

});

router.get("/liabilities/edit/:liability_type", isloggedin, function (req, res) {

    let type = req.params.liability_type;
    liabilities.editLiabilities(type, req.user).then(result => {

        res.json({
            liability_name: type,
            liability: result[0],
            amount: result[1],
            rate: result[2],
            duration: result[3],
            date: result[4]
        });

    }).catch(error => {
        console.log('error:', error);
    });

});

router.get("/addInsurance", function (req, res) {
    res.render("addInsurance");
})

router.get("/insurance", isloggedin, function (req, res) {

    let user = req.user;
    let display = "SELECT * FROM insurance_details WHERE userId = ?";
    database.query(display, user, function (error, result) {
        if (error) {
            console.log("error in displaying data.");
            throw error;
        }

        res.render("insurance", {
            data: result
        });

    })
})

router.get("/insurance/edit/:ins_type", isloggedin, function (req, res) {
    let user = req.user;
    let type = req.params.ins_type;
    let sql = "SELECT * FROM insurance_details WHERE userId = ? AND type = ?"
    let value = [user, type]

    database.query(sql, value, function (err, result) {
        res.render("editInsurance", {
            type: type,
            data: result
        });
    });
});

router.get("/insurance/delete/:ins_type", isloggedin, function (req, res) {
    let user = req.user;
    let type = req.params.ins_type;

    let delete_command = "DELETE FROM insurance_details WHERE userId = ? AND type = ?";
    let values = [user, type];

    database.query(delete_command, values, function (err, result) {
        if (err) throw err;
        console.log("row deleted successfully.");
    })
    res.redirect("/insurance");
})

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
    let r = req.body.interest_rate;
    let t = req.body.duration;
    let p = req.body.amount;
    let date = req.body.date;

    liabilities.calInterest(type, r, t, p, date, req.user).then(result => {
        res.redirect("/liabilities");

    }).catch(error => {
        console.log('error:', error);
    });
});

router.post("/liabilities/update/:label", function (req, res) {

    let name = req.params.label;
    let updateValue = req.body.amount;

    liabilities.updateIn_Ex(name, updateValue, req.user).then(result => {
        res.redirect("/liabilities");

    }).catch(error => {
        console.log('error:', error);
    });

});


router.post("/insurance", isloggedin, function (req, res) {

    database.query("CREATE TABLE IF NOT EXISTS insurance_details (userId varchar(30), type varchar(30), insurer varchar(30), startingDate varchar(10), endingDate varchar(10), Fee_of_Contract int)", function (err, result) {
        if (err) throw err;
        console.log("table created successfully!");
    })
    let userid = req.user;
    let ins_type = req.body.type;
    let insurer = req.body.insurerCompany;
    let start = req.body.startingAt;
    let end = req.body.endingAt;
    let fee = req.body.contractFee;

    let insert = "INSERT INTO insurance_details VALUES (?)";
    let values = [userid, ins_type, insurer, start, end, fee];

    database.query(insert, [values], function (err, result) {
        if (err) {
            console.log("error inserting insurance data to the database.");
            throw err;
        }
        console.log("1 record added to the table successfully.");
    })

    res.redirect("/insurance");
})

router.post("/insurance/edit/:ins_type", isloggedin, function (req, res) {

    let user = req.user;
    let type = req.params.ins_type;
    let insurer = req.body.insurerCompany;
    let start = req.body.startingAt;
    let end = req.body.endingAt;
    let fee = req.body.contractFee;

    let update = "UPDATE insurance_details SET insurer = ? , startingDate = ? , endingDate = ? , Fee_of_contract = ? WHERE userId = ? AND type = ?";
    let values = [insurer, start, end, fee, user, type];
    database.query(update, values, function (err, result) {
        if (err) throw err;
        console.log("table updated successfully.");
    })
    res.redirect("/insurance");
})



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
    con.query(sql, user_id, function (err, rows) {
        if (err) console.log(err);
        // console.log(rows);
        res.render('currentHoldings', { userName: rows[0].user_name });
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
    let sql = "select stock_id,quantity,symbol,price,buyDate,companyName from stocks where symbol like '%" + searchItem + "%' or companyName like '%" + searchItem + "%' and user_id = '" + user_id + "'";
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

router.post('/stockSplitHistory', async (req, res) => {
    const symbol = req.body.symbol;
    const url = 'https://api.polygon.io/v3/reference/splits?ticker=' + symbol + '&apiKey=' + process.env.polygonAPI1;
    const data = await fetch(url);
    const jsondata = await data.json();
    // console.log(jsondata);
    res.send(jsondata);
})

router.post('/dividendHistory', async (req, res) => {
    const symbol = req.body.symbol;
    let url = req.body.url;
    url += process.env.polygonAPI3;
    const data = await fetch(url);
    const jsondata = await data.json();
    // console.log(jsondata);
    res.send(jsondata);
})

router.get('/dashboard2', (req, res) => {
    res.render('dashboard2');
})



router.get("/profile", isloggedin, function (request, response, next) {

    let query = `SELECT a.*, b.user_email FROM user_details a, login_credentials b 
                WHERE a.user_id = b.user_id AND b.user_id = ?`;;

    database.query(query, request.user, function (error, data) {
        if (error) {
            throw error;
        } else {
            console.log(data);
            response.render('profile', { data: data[0] });
        }
    });
});

router.get("/profile/edit", isloggedin, function (req, res) {

    let query = `SELECT a.*, b.user_email FROM user_details a, login_credentials b 
                WHERE a.user_id = b.user_id AND b.user_id = ?`;

    database.query(query, req.user, function (error, data) {
        if (error) { throw error; } else {
            res.render('profileEdit', { data: data[0] });
        }
    });
});

router.get("/profileJSONdata", isloggedin, function (req, res) {

    let query = "SELECT * FROM user_details WHERE user_id = ?";
    database.query(query, req.user, function (error, data) {
        if (error) { throw error; } else {
            res.json(data[0]);
        }
    });
});

router.post("/profile/edit", isloggedin, function (req, res) {

    let fname = req.body.fname;
    let lname = req.body.lname;
    let pob = req.body.pob;
    let dob = req.body.dob;
    let address = req.body.address;
    let profession = req.body.profession;
    let qualification = req.body.qualification;
    let institute = req.body.institute;
    let course = req.body.course;
    let grade = req.body.grade;
    let email = req.body.email;
    let phone_no = req.body.phone_no;
    let gender = req.body.gender;

    let sql = `UPDATE user_details SET first_name = "${fname}", last_name = "${lname}", birth_place = "${pob}", 
                dob = "${dob}", address = "${address}", profession = "${profession}", 
                qualification = "${qualification}", institute = "${institute}", course = "${course}", 
                grade = "${grade}", email = "${email}", mobile_no = "${phone_no}", gender = "${gender}" 
                WHERE user_id = "${req.user}"`;

    database.query(sql, function (err, result) {
        if (err) { throw err; }
    });
    res.redirect("/profile");

});


router.post('/userAlreadyExist', (req, res) => {
    con.query('use portfolio_manager');
    const username = req.body.username;
    let sql = 'select * from login_credentials where user_name = ?';
    con.query(sql, username, (err, rows) => {
        if (err) console.log(err);
        if (rows.length > 0) {
            const existStatus = {
                status: 200
            }
            res.send(existStatus);
        }
        else {
            const existStatus = {
                status: 404
            }
            res.send(existStatus);
        }
    })
})

router.post('/username', async (req, res) => {
    con.query('use portfolio_manager');
    // const user_id = req.user;
    const user_id = '113720373204677842542';
    const promisePool = con.promise();
    const [rows, fields] = await promisePool.query("select user_name from login_credentials where user_id = '113720373204677842542'");
    // console.log(rows);
    const userName = {
        userName: rows[0].user_name
    }
    // console.log(userName);
    res.send(userName);
    // console.log(fields);
})

router.post('/dashboard/stocks', async (req, res) => {
    const symbolArr = [];
    const coresspondingSymbolArr = [];
    const buyDateArr = [];
    const buyPriceArr = [];
    const sellPriceArr = [];
    let totalCostPrice = 0;

    const data = {
        totalCostPrice: 0,
        growth: 0
    }
    const user_id = '113720373204677842542';
    con.query('use portfolio_manager');
    let sql2 = 'select symbol  from stocks where user_id = ? group by symbol';
    const promisePool = con.promise();
    let [rows, fileds] = await promisePool.query(sql2, user_id);

    rows.forEach(symbol => {
        symbolArr.push(symbol);
    });

    let sql = 'select quantity,price,symbol,buyDate,companyName from stocks where user_id = ?';
    [rows, fileds] = await promisePool.query(sql, user_id);
    for (let i = 0; i < rows.length; i++) {
        coresspondingSymbolArr.push(rows[i].symbol);
        let buyPrice = rows[i].quantity * rows[i].price;
        totalCostPrice += buyPrice;
        buyPriceArr.push(buyPrice);
        let date = new Date(rows[i].buyDate);
        date = date.toISOString().split('T')[0]
        const d = date.substring(5, 7) + "/" + date.substring(8, 10) + "/" + date.substring(0, 4);
        let buyDate = new Date(d);
        let todayDate = new Date().toLocaleDateString();
        let today = new Date(todayDate)
        let numberOfDays = (today.getTime() - buyDate.getTime()) / (1000 * 3600 * 24);
        buyDateArr.push(numberOfDays);
    }
    totalCostPrice = totalCostPrice.toFixed(2);
    data.totalCostPrice = totalCostPrice;

    for (let i = 0; i < symbolArr.length; i++) {
        let element = symbolArr[i];
        let url = 'https://api.polygon.io/v2/aggs/ticker/' + element.symbol + '/prev?adjusted=true&apiKey=' + process.env.polygonAPI5;
        const data = await fetch(url)
        const json = await data.json();
        sellPriceArr.push(json.results[0].o);
    }

    console.log(sellPriceArr);
    // console.log(symbolArr);
    // console.log(buyPriceArr);
    // console.log(buyDateArr);
    // console.log(sellPriceArr);

    



})

router.get("/dashboard/profile", isloggedin, function (req, res) {

    let sql = `SELECT first_name, last_name, profession FROM user_details WHERE user_id = ?`;

    database.query(sql, req.user, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

router.get("/dashboard/liabilities", isloggedin, function (req, res) {

    liabilities.liabilityData(req.user).then(result => {
        res.json({
            income_expense: result[0],
            liabilities: result[1],
            total_loan_amount: result[2],
            total_loan_interest: result[3],
        });
    }).catch(error => { throw error; });
});

router.get("/dashboard/insurance", isloggedin, function (req, res) {

    let sql = `SELECT type, insurer, endingDate FROM insurance_details WHERE userId = ?`;

    database.query(sql, req.user, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

module.exports = router;