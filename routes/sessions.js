const express = require('express');
const sessionsRouter = express.Router();
const sessionsController = require('../controllers/sessionsController');
// const {newBookValidatorMiddleware, updatedBookValidatorMiddleware} = require('../middlewares/validators/bookValidator');


sessionsRouter.post('/session/new', sessionsController.createNewSession);
sessionsRouter.put('/session/join', sessionsController.joinSession);
sessionsRouter.put('/session/pick_turn', sessionsController.pickTurn);
// booksRouter.get('/books/:id', BookController.getBookById);
sessionsRouter.put('/session/exit', sessionsController.exitSession);
// booksRouter.delete('/books/:id', BookController.deleteBook);


module.exports = sessionsRouter;