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

// Ruta ver el perfil

router.get('/profile', userController.profile)



router.get('/failedregister', userController.filedRegister)



module.exports = router;