const express = require('express');
const adminsRouter = express.Router();
const adminController = require('../controllers/adminController');

// Create new User
adminsRouter.post('/admins/create', adminController.createAdmin);
// Get all Users
// usersRouter.get('/users', userController.getAllUsers);
// // Get User by id
// usersRouter.get('/users/:id', userController.getUserById);
// // Update User info by id
// usersRouter.put('/users/:id', userController.updateUser);



module.exports = adminsRouter;