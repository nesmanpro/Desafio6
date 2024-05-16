const nodemailer = require('nodemailer');
const configObj = require('../config/dotenv.config.js');
const { user_mail, pass_mail } = configObj;



class mailingManager {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: user_mail,
                pass: pass_mail
            }
        });
    }


    async sendMailPurchase(email, first_name, ticket, productos) {
        try {
            const mailOptions = {
                from: `BamBam <${user_mail}>`,
                to: email,
                subject: 'Confirmación de compra',
                html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                    <p>Tu compra contiene: ${productos}</p>

                `
            };

            await this.transporter.sendMail(mailOptions);

        } catch (error) {

            console.error('Error al enviar el mail', error);

        }
    }

    async sendMailNewPass(email, first_name, token) {
        try {
            const mailOptions = {
                from: `BamBam <${user_mail}>`,
                to: email,
                subject: 'Recuperación de contraseña',
                html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Quieres reestablecer tu contraseña. Utiliza el siguiente código para cambiarla:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 60 min.</p>
                    <a href="http://localhost:8080/reset-password">Restablecer Contraseña</a>
                    <p>Si no has solicitado este restablecimiento, ignora este correo.</p>
                `
            }

            await this.transporter.sendMail(mailOptions);
        } catch (error) {

            console.error("Error al enviar el email:", error);
            throw new Error("Error al enviar el email");

        }
    }
}

module.exports = mailingManager;