const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require('../model/user')
const bcrypt = require('bcrypt')

// Configure Google Stretegy
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:3000/auth/google/callback`
  },
  async function(accessToken, refreshToken, profile, done) {

    console.log("accessToken: ", accessToken)
    console.log("Profile", profile)
    try{
        let user = await User.findOne({googleId: profile.id})
        console.log(user);
        
        if(user) {
            return done(null, user)
        }

        const newUser = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            googleImg: profile._json.picture,
            googleAccessToken: accessToken
        })

        return done(null, newUser);
    } catch(err) {
        done(err)
    }
  }
));

// Config Setup
passport.use(
	new LocalStrategy(async function (username, password, done) {
		try {
			let user = await User.findOne({ username: username });

			if (!user) return done(null, false);

			bcrypt.compare(password, user.password, function (err, result) {
                if(!result)
                    return done(null, false)

                return done(null, user)
            });
		} catch (err) {
			done(err);
		}
	})
);

// Passport Setup
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(async function(id, done) {
    try{
        let user = await User.findOne({_id: id})
        done(null, user)
    } catch(err) {
        done(err);
    }
});

module.exports = passport