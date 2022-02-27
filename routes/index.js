const router = require("express").Router();
require('dotenv').config();
const passport = require("passport");
// require("../auth_facebook");
// require("../auth_google");
// require("../auth_local");
const bcrypt = require("bcrypt");
const mysql2 = require("mysql2");
const flash = require("express-flash");


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
router.post("/login", passport.authenticate('local-signIn',{
    successRedirect:'/complete',
    failureRedirect: '/login',
    failureFlash: true
}),
 function (req, res) {
    // res.redirect("/complete");
})


router.post("/signup", passport.authenticate('local-signup',{
    successRedirect:'/login',
    failureRedirect: '/signup',
    failureFlash: true
}),
    function (req, res) {
        console.log("i am signup page");
    }
)


module.exports = router;