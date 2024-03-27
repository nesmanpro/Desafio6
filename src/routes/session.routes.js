const express = require('express');
const router = express.Router();
const passport = require('passport');

// Service / controller
const SessionController = require('../controller/sessionController.js');
const sessionController = new SessionController();


//Con passport
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), sessionController.login)


router.get('/faillogin', sessionController.failLogin)

// endpoint de current
router.get('/current', sessionController.current)



//Para github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), sessionController.github);

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), sessionController.githubCallBack)



// Endpoint para Logout

router.get('/logout', sessionController.destroy)


module.exports = router;