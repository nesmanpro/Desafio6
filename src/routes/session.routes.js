const express = require('express');
const router = express.Router();
const UserModel = require('../dao/models/user.model.js');
const { isValidPassword } = require("../utils/hashBcrypt.js");


// Endpoint para Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const admin = {
        first_name: 'Coder',
        last_name: 'House',
        email: 'adminCoder@coder.com',
        password: 'adminCod3r123',
        role: 'admin'
    }


    try {
        const user = await UserModel.findOne({ email: email });

        if (admin.email === email && admin.password === password) {
            req.session.login = true;
            req.session.user = { ...admin };
            res.redirect('/products');
            return
        }

        user
            ? isValidPassword(password, user)
                ? (
                    req.session.login = true,
                    req.session.user = {
                        email: user.email,
                        role: user.role,
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

    if (req.session.login) {
        req.session.destroy
    }

    res.redirect("/login");

})


module.exports = router;