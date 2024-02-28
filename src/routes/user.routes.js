const express = require('express');
const router = express.Router();
const UserModel = require('../dao/models/user.model.js');
const { createHash } = require("../utils/hashBcrypt.js");



router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ error: "El correo electrónico ya se ha registrado" });
        }

        const newUser = await UserModel.create({ first_name, last_name, email, password: createHash(password), role });

        req.session.login = true;
        req.session.user = { ...newUser._doc };

        res.redirect("/login");
        console.error("Usuario creado con exito");

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
});


module.exports = router;