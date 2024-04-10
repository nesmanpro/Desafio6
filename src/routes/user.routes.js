const express = require('express');
const router = express.Router();
const passport = require('passport');

// Service / controler
const UserController = require('../controller/userController.js');
const userController = new UserController();


//Version con Passport
router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failedregister'
}), userController.register)
// Endpoint ver el perfil
router.get('/profile', userController.profile)
// Endpoint si falla registro
router.get('/failedregister', userController.filedRegister)



module.exports = router;