const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const UserModel = require('../../models/users');
const AdminModel = require('../../models/admins');


// passport.use(
//     new JWTstrategy(
//         {
//             secretOrKey: process.env.JWT_SECRET,
//             jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
//         },
//         async (token, done) => {
//             try {
//                 // Check if the token is expired
//                 if (Date.now() >= token.exp * 1000) {
//                     return done(null, false, { message: 'Token expired' });
//                 }

//                 // Token is valid, return the user
//                 return done(null, token.user);
//             } catch (error) {
//                 done(error);
//             }
//         }
//     )
// );



// Admin JWT strategy
passport.use(
	new JWTstrategy(
		{
			secretOrKey: process.env.ADMIN_JWT_SECRET,
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
		},
		async (token, done) => {
			try {
				const admin = await AdminModel.findById(token.admin._id);
				if (!admin) {
					return done(null, false, { message: 'Admin not found' });
				}
				return done(null, admin);
			} catch (error) {
				done(error);
			}
		}
	)
);


// User JWT strategy
passport.use(
	new JWTstrategy(
		{
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
		},
		async (token, done) => {
			try {
				const user = await UserModel.findById(token.user._id);
				if (!user) {
					return done(null, false, { message: 'User not found' });
				}
				return done(null, user);
			} catch (error) {
				done(error);
			}
		}
	)
);



// Admin Sign Up
passport.use(
  'admin-signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      const { fullName } = req.body;
      try {
        console.log("IN PASSPORT ADMIN SIGNUP");

        const user = await AdminModel.create({ fullName, email, password });
        return done(null, user);
      } catch (error) {
        // Check for the specific MongoDB duplicate key error
        if (error.code === 11000 && error.keyValue && error.keyValue.email) {
          return done(null, false, { message: 'User already exists with that email' });
        }
        return done(error);
      }
    }
  )
);



// Admin login strategy
passport.use(
	'admin-login',
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const admin = await AdminModel.findOne({ email });
				if (!admin) {
					return done(null, false, { message: 'Admin not found' });
				}
				const validate = await admin.isValidPassword(password);
				if (!validate) {
					return done(null, false, { message: 'Wrong Password' });
				}
				return done(null, admin, { message: 'Admin logged in Successfully' });
			} catch (error) {
				return done(error);
			}
		}
	)
);





// User Sign Up
passport.use(
	'user-signup',
	new LocalStrategy(
		{

			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true

		},
		async (req, email, password, done) => {
			const { username } = req.body;
			try {
				console.log("IN PASSPORT USER SIGNUP")
				const user = await UserModel.create({ username, email, password });
				return done(null, user);
			} catch (error) {
				done(error);
			}
		}
	)
);



// User login strategy
passport.use(
	'user-login',
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const user = await UserModel.findOne({ email });
				if (!user) {
					return done(null, false, { message: 'User not found' });
				}
				const validate = await user.isValidPassword(password);
				if (!validate) {
					return done(null, false, { message: 'Wrong Password' });
				}
				return done(null, user, { message: 'User logged in Successfully' });
			} catch (error) {
				return done(error);
			}
		}
	)
);