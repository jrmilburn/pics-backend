const { Router } = require('express');
const messageRouter = Router();
const messageController = require('../controllers/messageController');

messageRouter.get('/:id', messageController.getMessages);
messageRouter.post('/', messageController.sendMessage);

module.exports = messageRouter;