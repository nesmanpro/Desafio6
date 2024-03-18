const express = require('express');
const router = express.Router();
const passport = require('passport');


//Version con Passport

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failedregister'
}), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 'error', message: 'Credenciales invalidas!' });

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cart: req.user.cart
    };

    req.session.login = true;

    res.redirect("/");

})

// Ruta ver el perfil

router.get('/profile', (req, res) => {
    if (req.session.user) {
        res.render('profile', { user: req.session.user })
    } else {
        res.redirect('/login')
    }
})



router.get('/failedregister', (req, res) => {
    res.send({ error: 'Registro fallido, revisar user.routes.js' })
})



module.exports = router;