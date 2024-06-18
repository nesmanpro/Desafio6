
import nodemailer from 'nodemailer';
import configObj from '../config/dotenv.config.js';

const { user_mail, pass_mail } = configObj;



export default class mailingManager {

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

    async sendMailUserDeleted(email, first_name) {
        try {

            const mailOptions = {
                from: `BamBam <${user_mail}>`,
                to: email,
                subject: 'Éste usuario fue eliminado por falta de actividad',
                html: `
                    <h1>Usuario borrado: 
                    <br>
                    <strong>${email}</strong>
                    <br>
                    </h1>
                    <p>Hola ${first_name},</p>
                    <br>
                    <p>Nos ponemos en contacto contigo para comunicarte que lamentamos hemos tenido que eliminar tu usuario por falta de actividad. No te preocupes, siempre puedes volver a registrarte. 
                    <br>
                    Lamentamos las molestias.</p>
                    <br>
                    <br>
                    <a href="http://localhost:8080/register">Aqui puedes volver a registrarte</a>
                `
            }
            await this.transporter.sendMail(mailOptions);

        } catch (error) {
            console.error("Error al enviar el email:", error);
            throw new Error("Error al enviar el email");
        }
    }

    async sendMailDeletedByAdmin(email, first_name) {
        try {

            const mailOptions = {
                from: `BamBam <${user_mail}>`,
                to: email,
                subject: 'Este usuario fue eliminado por el administrador',
                html: `
                <h2>Usuario borrado: 
                <br>
                <strong>${email}</strong>
                </h2>
                <br>
                <p>Hola ${first_name},</p>
                <br>
                <p>Nos ponemos en contacto contigo para comunicarte que el administrador ha eliminado tu usuario. Si lo deseas, puedes volver a registrarte. 
                <br>
                Lamentamos las molestias.</p>
                <br>
                <br>
                <a href="http://localhost:8080/register">Aqui puedes volver a registrarte</a>
                `
            }
            await this.transporter.sendMail(mailOptions);

        } catch (error) {
            console.error("Error al enviar el email:", error);
            throw new Error("Error al enviar el email");
        }
    }

    async sendProdDeletedByAdmin(data) {
        try {
            const { to, pid, title } = data;

            const mailOptions = {
                from: `BamBam <${user_mail}>`,
                to: to,
                subject: 'Este producto fue eliminado',
                html: `
                <h2>Producto borrado: 
                <br>
                </h2>
                <strong>${title}</strong>
                <p>con ID: <strong>${pid}</strong></p>
                <br>
                <p>Hola ${to},</p>
                <br>
                <p>Nos ponemos en contacto contigo para comunicarte que se ha eliminado uno de tus productos. 
                <br>
                Lamentamos las molestias.</p>
                `
            }
            await this.transporter.sendMail(mailOptions);

        } catch (error) {
            console.error("Error al enviar el email:", error);
            throw new Error("Error al enviar el email");
        }
    }
}
