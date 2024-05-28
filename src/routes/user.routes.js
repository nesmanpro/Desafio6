
import express from 'express';
import passport from 'passport';

// Service / controller
import UserController from '../controller/userController.js';
const userController = new UserController();

const router = express.Router();

//Version con Passport
router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failedregister'
}), userController.register);
// Endpoint ver el perfil
router.get('/profile', userController.profile);
// Endpoint si falla registro
router.get('/failedregister', userController.filedRegister);
//endpoint cambiar roll
router.put("/premium/:uid", userController.becomePremium);



export default router;
