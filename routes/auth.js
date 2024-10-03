const express = require('express');
const authRouter = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Admin Sign Up
authRouter.post('/admin/signup', passport.authenticate('admin-signup', { session: false }), async (req, res, next) => {
    res.json({
        message: 'Admin Signup successful',
        user: req.user
    });
});

// User Sign Up
authRouter.post('/user/signup', passport.authenticate('user-signup', { session: false }), async (req, res, next) => {
    res.json({
        message: 'User Signup successful',
        user: req.user
    });
});



// Login route for admins with valid credentials using passport
authRouter.post('/admin/login', async (req, res, next) => {
    passport.authenticate('admin-login', async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An error occurred.');
                return next(error);
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error);
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
                return res.json({ token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});




// Login route for users with valid credentials using passport
authRouter.post('/user/login', async (req, res, next) => {
    passport.authenticate('user-login', async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An error occurred.');
                return next(error);
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error);
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, process.env.JWT_SECRET);
                return res.json({ token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});


module.exports = authRouter;