const express = require('express')
const supportController = require('../controllers/SupportController')
const router = express.Router()

router
    .post('/', supportController.sendUsMessage)
    .get('/', supportController.getSupportMessages)



module.exports = router