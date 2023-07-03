const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController')

router
    .post('/', chatController.addMessage)
    .get('/:clientId', chatController.getChatByClientId)
    .get('/admin/:clientId', chatController.getChatByClientIdAdmin)
    .get('/', chatController.getAllChats)
    .get('/unread/count', chatController.countAdminUnread)
    .delete('/:chatId', chatController.deleteChat)

module.exports = router