const express = require('express');
const router = express.Router();
const passport = require('passport');


//Con passport
router.post('/login', passport.authenticate('login', { failureRedirect: '/api/session/faillogin' }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: 'error', message: 'Credenciales no validas!' });

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cart: req.user.cart
    };

    req.session.login = true;

    res.redirect('/')
})


router.get('/faillogin', async (req, res) => {
    console.log('Fallo la estrategia, revisar codigo')
    res.send({ error: 'No funciono la estrategia, hay q revistar session.router.js' })
})

// endpoint de current
router.get('/current', async (req, res) => {

    if (!req.user) return res.status(400).send({ status: 'error', message: 'No hay usuario logeado en este momento' });

    res.json(req.user)
})



//Para github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect('/products');
})



// Endpoint para Logout

router.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect('/login')
})


module.exports = router;