const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')

// router.use(verifyJWT);

router
    .get('/', userController.getAllUsers)
    // .get('/account/:userId', userController.getUserById)
    .post('/', userController.createNewUser)
    // .patch('/:user_Id', userController.updateUser)
    // .delete('/delete/:userId', userController.deleteUser);

module.exports = router;