

import userDTO from '../DTO/userDTO.js';
import UserModel from "../models/user.model.js";
import UserRepository from '../repositories/userRepository.js';
const userRepo = new UserRepository();


export default class UserController {

    async register(req, res) {
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

    }

    profile(req, res) {
        //Con DTO: 
        const userDto = new userDTO(req.user.first_name, req.user.last_name, req.user.role);

        if (req.session.user) {
            res.render("profile", { user: userDto });
        } else {
            res.redirect('/login')
        }
    }


    filedRegister(req, res) {
        res.send({ error: 'Registro fallido, revisar user.routes.js' })
    }


    async becomePremium(req, res) {

        try {
            const { uid } = req.params;
            const user = await userRepo.findById(uid);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Verificar que se han cargado los documentos
            const requiredDocs = ['profile', 'products', 'document'];
            const userDocs = user.documents.map(doc => doc.name);

            const hasRequiredDocuments = requiredDocs.every(doc => userDocs.includes(doc));

            if (!hasRequiredDocuments) {
                return res.status(400).json({
                    message: 'Debes cargar los siguientes documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta'
                });
            }


            const newRol = user.role === 'user' ? 'premium' : 'user';

            const updated = await UserModel.findByIdAndUpdate(uid, { role: newRol }, { new: true });

            res.json(updated);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }


}
