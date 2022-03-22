require('dotenv').config();
const mysql2 = require("mysql2");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const insertNewUserRows = require("./insert_new_user_rows");

const con = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
},
    function (accessToken, refreshToken, profile, done) {
        let userId = profile._json.sub;
        let userName = profile._json.name;
        let userEmail = profile._json.email;


        con.query("use portfolio_manager");
        let sql = "SELECT user_id FROM login_credentials where user_id = ?;";
        con.query(sql, userId, function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length === 0) {
                console.log("No user found");
                let sql = "INSERT INTO login_credentials values(?, ?, ?)";
                con.query(sql,[userId, userName, userEmail], function(err, result){
                    if(err) throw err;
                    console.log("1 record inserted");
                });

                insertNewUserRows.insertRows(User.userId);
            }
            else {
                console.log(result);
            }
        });
        return done(null, profile);

    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});