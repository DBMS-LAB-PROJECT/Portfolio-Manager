const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

const FACEBOOK_APP_ID = "407613297790816";
const FACEBOOK_APP_SECRET = "d327195c5ce86e0bde5521eea7b31edc";

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user,done){
    done(null, user);
});