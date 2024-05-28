

import express from 'express';
import passport from 'passport';

// Service / controller
import SessionController from '../controller/sessionController.js';
const sessionController = new SessionController();

const router = express.Router();


//Con passport
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), sessionController.login)
// endpoint si falla el login
router.get('/faillogin', sessionController.failLogin)
// endpoint de current
router.get('/current', sessionController.current)
//endpoint de github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), sessionController.github);
//endpoint si falla github
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), sessionController.githubCallBack)
// Endpoint para Logout
router.get('/logout', sessionController.destroy)


//endpoint enviar mail de reestablecimiento
router.post('/resetPassword', sessionController.requestPasswordReset);
//endpoint enviar mail de reestablecimiento
router.post('/changePassword', sessionController.resetPassword);




export default router;