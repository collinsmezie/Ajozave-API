// const express = require('express');
// const sessionsRouter = express.Router();
// const sessionsController = require('../controllers/sessionsController');
// const passport = require('passport');

// // const {newBookValidatorMiddleware, updatedBookValidatorMiddleware} = require('../middlewares/validators/bookValidator');


// sessionsRouter.post('/session/new', passport.authenticate('jwt', {session: false}), sessionsController.createSession);


// sessionsRouter.put('/session/join', sessionsController.joinSession);
// sessionsRouter.put('/session/pick_turn', sessionsController.pickTurn);
// // booksRouter.get('/books/:id', BookController.getBookById);
// sessionsRouter.put('/session/exit', sessionsController.exitSession);
// // booksRouter.delete('/books/:id', BookController.deleteBook);


// module.exports = sessionsRouter;










// routes/sessionsRouter.js

const express = require('express');
const sessionsRouter = express.Router();
const sessionsController = require('../controllers/sessionsController');
const passport = require('passport');
const validateRequest = require('../middlewares/validateRequest');
const {
  createSessionSchema,
  joinSessionSchema,
  pickTurnSchema,
  exitSessionSchema,
} = require('../middlewares/Validators/sessionValidator');

sessionsRouter.get(
  '/sessions',
  passport.authenticate('jwt', { session: false }),

  sessionsController.getAllSessions
);


sessionsRouter.get(
  '/sessions/:id',
  passport.authenticate('jwt', { session: false }),
  sessionsController.getSessionById
);


sessionsRouter.post(
  '/session/new',
  passport.authenticate('jwt', { session: false }),
  validateRequest(createSessionSchema),
  sessionsController.createSession
);



sessionsRouter.put(
  '/session/join',
  validateRequest(joinSessionSchema),
  sessionsController.joinSession
);

sessionsRouter.put(
  '/session/pick_turn',
  validateRequest(pickTurnSchema),
  sessionsController.pickTurn
);

sessionsRouter.put(
  '/session/exit',
  validateRequest(exitSessionSchema),
  sessionsController.exitSession
);

module.exports = sessionsRouter;
