const express = require('express');
const usersRouter = express.Router();
const userController = require('../controllers/usersController');
const passport = require('passport');

// Create new User
usersRouter.post('/users/create', userController.createUserAccount);
// Get all Users
usersRouter.get('/users', passport.authenticate('jwt', {session: false}), userController.getAllUsers);
// // Get User by id
// usersRouter.get('/users/:id', userController.getUserById);
// // Update User info by id
// usersRouter.put('/users/:id', userController.updateUser);



module.exports = usersRouter;