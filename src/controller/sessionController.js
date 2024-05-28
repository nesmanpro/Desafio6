import generateResetToken from "../utils/resetToken.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import UserModel from "../models/user.model.js";
import MailingManager from "../utils/mailing.js";

const mailingManager = new MailingManager();


export default class SessionController {

    async login(req, res) {
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
    }

    async failLogin(req, res) {
        req.logger.warning('Fallo la estrategia, revisar codigo')
        res.redirect('/error')
    }

    async current(req, res) {

        if (!req.user) return res.status(400).send({ status: 'error', message: 'No hay usuario logeado en este momento' });

        res.json(req.user)
    }

    async github(req, res) { }

    async githubCallBack(req, res) {
        req.session.user = req.user;
        req.session.login = true;
        res.redirect('/products');
    }

    destroy(req, res) {
        if (req.session.login) {
            req.session.destroy();
        }
        res.redirect('/login')
    }


    async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            // Buscar al usuario por su correo electrónico
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Generar un token 
            const token = generateResetToken();

            // Guardar el token en el usuario
            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000) // 1 hora de duración
            };
            await user.save();

            // Enviar correo electrónico con el enlace de restablecimiento utilizando EmailService
            await mailingManager.sendMailNewPass(email, user.first_name, token);

            res.redirect("/confirmationSent");
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }


    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            // Buscar si usuario existe
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.render("resetPass", { error: "Usuario no encontrado" });

            }

            // Obtener el token 
            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {

                return res.render("resetPass", { error: "El codigo de restablecimiento no es el correcto" })
            }

            // Verificar si el token esta vigente
            const now = new Date();
            const then = new Date(resetToken.expiresAt)
            if (now > then) {
                return res.render("forgot", { error: "El tiempo para cambiar la contraseña ha expirado" })
            }

            // Verificar si la nueva contraseña es la anterior
            if (isValidPassword(password, user)) {
                return res.render("resetPass", { error: "La nueva contraseña no puede ser igual a la anterior" })
            }

            // Actualizar la contraseña y anula token del usuario
            user.password = createHash(password);
            user.resetToken = undefined;
            await user.save();

            // Confirmar de cambio de contraseña
            return res.redirect("/login");
        } catch (error) {
            console.error(error);
            return res.status(500).render("forgot", { error: "Error interno del servidor" });
        }
    }



}

