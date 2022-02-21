const express = require("express");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const passport = require("passport");
const ejs = require("ejs");
const session = require("express-session");

require("./auth_facebook");

function isloggedin(req, res, next){
    req.user ? next() : res.sendStatus(401);
}
const app = express();
app.use(session({secret: "cats"}));
app.use(passport.initialize());
app.use(passport.session());


app.set("view engine", "ejs");
app.use(express.static("public"));



app.get("/", function (req, res) {
    res.render("login");
});


app.get("/auth/facebook", 
    passport.authenticate("facebook", {scope: ["email" , "profile"]})
)


app.get("/auth/facebook/callback",
    passport.authenticate("facebook",{
        successRedirect: "/complete",
        failureRedirect: "/auth/failure",
    })
);

app.get("/auth/failure", function(req, res){
    res.send("OOps login failed"); 
})

app.get("/complete", isloggedin, function (req, res) {
    res.render("complete");
});



app.get("/logout", function(req, res){
    req.logOut();
    req.session.destroy();
    res.send("good bye");
})


app.listen(3000, function () {
    console.log("Server is up and running on port 3000");
});
