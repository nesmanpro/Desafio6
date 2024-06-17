

import userDTO from '../DTO/userDTO.js';
import UserModel from "../models/user.model.js";
import UserRepository from '../repositories/userRepository.js';
const userRepo = new UserRepository();
import CartRepository from '../repositories/cartRepository.js';
const cartRepo = new CartRepository();
import MailingManager from "../utils/mailing.js";
const mailingManager = new MailingManager();


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
        try {
            //Con DTO: 
            const userDto = new userDTO(req.user.first_name, req.user.email, req.user.role);

            if (req.session.user) {
                res.render("profile", { user: userDto });
            } else {
                res.redirect('/login')
            }
        } catch (error) {
            req.logger.error("Error al acceder al usuario", error);
        }
    }


    filedRegister(req, res) {
        res.send({ error: 'Registro fallido, revisar user.routes.js' })
        req.logger.error("Registro fallido", error);

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
            req.logger.error("Error al intentar acceder a los datos", error);

        }
    }


    async getUsers(req, res) {
        try {
            const _allUsers = await userRepo.getAllUsers();
            const userDtos = _allUsers.map(user => new userDTO(user.first_name, user.email, user.role));

            res.json(userDtos)
            console.log(_allUsers)
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
            req.logger.error("Error al obtener los usuarios", error);
        }
    }

    async deleteOldUsers(req, res) {
        try {
            const _aallUsers = await userRepo.getAllUsers();
            const _now = new Date();

            // calcula el tiempo de inactividad de los usuarios
            const _inactiveUsers = _aallUsers.filter(user => {
                const _lastConnection = new Date(user.last_connection);
                const _diffInHours = (_now - _lastConnection) / (1000 * 60 * 60);
                return _diffInHours > 48;
            })


            //Borra el usuario y su correspondiente carrito
            _inactiveUsers.map(async user => {
                userRepo.deleteUserById(user.id);
                await cartRepo.deleteCartById(user.cart);
                console.log({ message: `Este usuario ${user.id} y su carrito (id:${user.cart}) han sido eliminados.` })
                await mailingManager.sendMailUserDeleted(user.email, user.first_name)
            })

            const deletedNumber = _inactiveUsers ? _inactiveUsers.length : '0'

            const _updatedList = await userRepo.getAllUsers();
            res.json({
                message: `Se encontraron con exito ${deletedNumber} usuarios inactivos${deletedNumber > 0 ? ' y ya han sido eliminados' : ''}. Así es como queda la lista actualizada de usuarios ahora: `,
                users_updated: _updatedList,
            })



        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
            req.logger.error("Error al intentar borrar al usuario", error);

        }
    }

    async deleteUserById(req, res) {
        try {

            const { uid } = req.params;
            const user = await userRepo.findById(uid);



            // Borra el usuario y su correspondiente carrito
            await userRepo.deleteUserById(user._id);
            await cartRepo.deleteCartById(user.cart);
            console.log({ message: `Este usuario ${user.id} y su carrito (id:${user.cart}) han sido eliminados.` })
            await mailingManager.sendMailDeletedByAdmin(user.email, user.first_name)

            res.json({
                message: `Se borro con exito el usuarios ${user._id}.`
            })



        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
            req.logger.error("Error al intentar borrar al usuario", error);

        }
    }


}
