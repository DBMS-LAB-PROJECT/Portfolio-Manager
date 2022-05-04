require('dotenv').config();
const mysql2 = require("mysql2");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const insertNewUserRows = require("./insert_new_user_rows");

const con = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

const customFields = {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
};

const verfiyCallbackSignUp = function(req, username, password, done){ 
    var User = {
        userName: username,
        email: req.body.email,
        password: password,
        userId: bcrypt.hashSync(password, 10)
    };

    // console.log(User.userName);
    // console.log(User.email);
    // console.log(User.password);
    // console.log(User.userId);

    con.query("use portfolio_manager");

    let sql = "SELECT user_name FROM login_credentials where user_name = ?;";
    con.query(sql, User.userName, function (err, result) {
        if (err) throw err;
        if (result.length > 0) 
        {
            console.log("User already exist");
            return done(null, false, {message: 'That username is already taken.'});
        }
        else 
        {
            console.log("No user found");
            let sql = "INSERT INTO login_credentials values(?,?,?)";
            con.query(sql, [User.userId, User.userName, User.email], function (err, result){
                if (err) throw err;
                console.log("result");
                console.log("1 record inserted");
            });

            insertNewUserRows.insertRows(User.userId);
        }
        // console.log(User);
        return done(null , User);
    })
}


const verfiyCallbackSignIn = function(req, username, password, done){ 
    var User = {
        userName: username,
        password: password,
        userId: bcrypt.hashSync(password, 10)
    };

    // console.log(User.userName);
    // console.log(User.password);
    // console.log(User.userId);

    con.query("use portfolio_manager");

    let sql = "SELECT * FROM login_credentials where user_name = ? or user_email = ?;";
    con.query(sql, [User.userName, User.userName], function (err, rows) {
        if (err) done(err);
        if (!rows.length) 
        {
            console.log("No user found");
            return done(null, false, {message: 'No user with that username'});
        }
        if (!bcrypt.compareSync(password, rows[0].user_id))
                    return done(null, false, {message:"Username or password doesn't match"});
        return done(null, rows[0].user_id);
    });
}

const strategySignUP = new localStrategy(customFields, verfiyCallbackSignUp);
passport.use("local-signup",strategySignUP);

const strategySignIn = new localStrategy(customFields, verfiyCallbackSignIn);
passport.use("local-signIn", strategySignIn);

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
})

