const express = require('express');
const router = express.Router();
const passport = require('passport');

//Version con Passport

router.post('/', passport.authenticate('register', {
    failureRedirect: '/failedregister'
}), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 'error', message: 'Credenciales invalidas!' });

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: 'User'

    }

    req.session.login = true;

    res.redirect("/login");

})

router.get('/failedregister', (req, res) => {
    res.send({ error: 'Registro fallido, revisar user.routes.js' })
})



module.exports = router;