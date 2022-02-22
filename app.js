const express = require("express");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const passport = require("passport");
const ejs = require("ejs");
const session = require("express-session");
const { Cookie } = require("express-session");

require("./auth_facebook");
require("./auth_google");


function isloggedin(req, res, next){
    req.user ? next() : res.sendStatus(401);
}
const app = express();

// app.use(session({secret:'yoursecret'}, {resave:false},{saveUninitialized: false}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());


app.set("view engine", "ejs");
app.use(express.static("public"));



app.get("/", function (req, res) {
    res.render("login");
});

app.get("/auth/google", 
    passport.authenticate("google", {scope: ["email" , "profile"]})
)

app.get('/auth/facebook',
  passport.authenticate('facebook'));


app.get("/google/callback",
    passport.authenticate("google",{
        successRedirect: "/complete",
        failureRedirect: "/auth/failure",
    })
);

app.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/auth/failure' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/complete');
  });

app.get("/auth/failure", function(req, res){
    res.send("OOps login failed"); 
})

app.get("/complete", isloggedin, function (req, res) {
    res.render("complete");
});


app.get("/logout", function(req, res){
    req.logOut();
    req.session.destroy();
    res.redirect("/");
})


app.listen(3000, function () {
    console.log("Server is up and running on port 3000");
});
