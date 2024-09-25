const { Router } = require('express');
const followerController = require('../controllers/followerController');

const followRouter = Router();

followRouter.get('/', followerController.getNotFollowing);
followRouter.post('/', followerController.follow);
followRouter.delete('/:id', followerController.unFollow);

module.exports = followRouter;