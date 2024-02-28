const express = require('express');
const router = express.Router();
const UserModel = require('../dao/models/user.model.js');


// Endpoint para Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await UserModel.findOne({ email: email });

        usuario
            ? usuario.password === password
                ? (
                    req.session.login = true,
                    res.redirect('/products')
                )
                : res.status(401).send({ error: 'Contraseña no válida' })
            : res.status(400).send({ error: 'Usuario no encontrado!' });
    } catch (error) {
        res.status(400).send({ error: 'Error al iniciar sesión!' })
    }
});

// Endpoint para Logout

router.get('/logout', async (req, res) => {

    req.session.login & req.session.destroy

    res.status(200).send({ Message: 'Login eliminado' })

})


module.exports = router;