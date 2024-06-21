const express = require('express');
const usersRouter = express.Router();
const userController = require('../controllers/usersController');

// Create new User
usersRouter.post('/users/create', userController.createUser);
// Get all Users
// usersRouter.get('/users', userController.getAllUsers);
// // Get User by id
// usersRouter.get('/users/:id', userController.getUserById);
// // Update User info by id
// usersRouter.put('/users/:id', userController.updateUser);



module.exports = usersRouter;