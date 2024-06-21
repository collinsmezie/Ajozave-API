const express = require('express');
const testbooksRouter = express.Router();
const testBookController = require('../controllers/testbookController');

// Get all books
testbooksRouter.get('/testbooks', testBookController.getAllBooks);

// Get all books by author
testbooksRouter.get('/testbooks/author/:authorId', testBookController.getAllBooksByAuthor);


module.exports = testbooksRouter;