// routes/sessionsRouter.js

const express = require('express');
const sessionsRouter = express.Router();
const sessionsController = require('../controllers/sessionsController');
const passport = require('passport');
const validateRequest = require('../middlewares/validateRequest');
const {
  createSessionSchema,
  addMembersSchema,
  deleteMemberSchema,
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
  '/sessions/:sessionId',
  passport.authenticate('jwt', { session: false }),
  sessionsController.getSessionById
);


sessionsRouter.post(
  '/sessions/new',
  passport.authenticate('jwt', { session: false }),
  validateRequest(createSessionSchema),
  sessionsController.createSession
);

sessionsRouter.put(
  '/sessions/add-members',
  passport.authenticate('jwt', { session: false }),
  // validateRequest(sessionIdSchema, 'params'),
  validateRequest(addMembersSchema),
  sessionsController.addMembersToSession
);

sessionsRouter.delete(
  '/sessions/:sessionId/members/:memberId',
  passport.authenticate('jwt', { session: false }),
  validateRequest(deleteMemberSchema, 'params'),
  sessionsController.deleteMemberFromSession
);

sessionsRouter.delete(
  '/sessions/:sessionId',
  passport.authenticate('jwt', { session: false }),
  // validateRequest(deleteMemberSchema, 'params'),
  sessionsController.deleteSession
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
