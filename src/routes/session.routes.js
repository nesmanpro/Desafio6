const express = require('express');
const router = express.Router();
const UserModel = require('../dao/models/user.model.js');
const { isValidPassword } = require("../utils/hashBcrypt.js");


// Endpoint para Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });

        user
            ? isValidPassword(password, user)
                ? (
                    req.session.login = true,
                    req.session.user = {
                        email: user.email,
                        age: user.age,
                        first_name: user.first_name,
                        last_name: user.last_name,
                    },
                    res.redirect('/profile')
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