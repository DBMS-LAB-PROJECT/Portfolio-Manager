require('dotenv').config();
const mysql2 = require("mysql2");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
 
const con = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/facebook/callback", 
},
    function (accessToken, refreshToken, profile, cb) {
        let userId = profile._json.id;
        let userName = profile._json.name;

        con.query("use portfolio_manager");
        let sql = "SELECT user_id FROM login_credentials where user_id = ?;";
        con.query(sql, userId, function (err, result) {
            if (err) {
                throw err;
            }
            if (result.length === 0) {
                console.log("No user found");
                let sql = "INSERT INTO login_credentials values(?, ?, NULL)";
                con.query(sql,[userId, userName], function(err, result){
                    if(err) throw err;
                    console.log("1 record inserted");
                });
            }
            else {
                console.log(result);
            }
        });
        return cb(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

