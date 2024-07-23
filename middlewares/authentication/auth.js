const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const UserModel = require('../../models/users');


passport.use(
    new JWTstrategy(
        {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
        },
        async (token, done) => {
            try {
                // Check if the token is expired
                if (Date.now() >= token.exp * 1000) {
                    return done(null, false, { message: 'Token expired' });
                }
                
                // Token is valid, return the user
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);



passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                console.log("IN PASSPORT LOGIN")

                const user = await UserModel.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                const validate = await user.isValidPassword(password);
                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }
                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);



passport.use(
    'signup',
    new LocalStrategy(
        {

            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true

        },
        async (req, email, password, done) => {
            const { first_name, last_name } = req.body;
            try {
                console.log("IN PASSPORT SIGNUP")
                const user = await UserModel.create({ first_name, last_name, email, password });
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
);