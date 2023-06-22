const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController')

router
    .post('/', chatController.addMessage)
    .get('/:clientId', chatController.getChatByClientId)
    .get('/', chatController.getAllChats)

module.exports = router