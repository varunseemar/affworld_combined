const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../schemas/user.schema');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            // Create new user if not exists
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: null, // No password for Google auth
                googleId: profile.id
            });

            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWTOKEN);

        return done(null, { user, token });
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;