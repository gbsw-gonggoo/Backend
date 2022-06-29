const passport = require('passport');
const local = require('./localStrategy');

module.exports = () => {
    passport.serializeUser( (user, done) => {
        done(null, user);
    })

    passport.deserializeUser( (user, done) => {
        const info = { user: user }
        done(null, info);
    });

    local();
}