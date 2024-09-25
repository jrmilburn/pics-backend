const { passport } = require('../config/passport');
const { Router } = require('express');
const commentRouter = Router();
const commentController = require('../controllers/commentController');

commentRouter.post('/',  passport.authenticate('jwt', { session: false }), commentController.createComment);

module.exports = commentRouter;