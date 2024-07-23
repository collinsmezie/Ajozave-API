const express = require('express');
const adminsRouter = express.Router();
const adminController = require('../controllers/adminController');

// Create new Admin
adminsRouter.post('/admins/new', adminController.createAdminAccount);
// Get all Users
// usersRouter.get('/users', userController.getAllUsers);
// // Get User by id
// usersRouter.get('/users/:id', userController.getUserById);
// // Update User info by id
// usersRouter.put('/users/:id', userController.updateUser);



module.exports = adminsRouter;