import UserModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";
import MailingManager from "../utils/mailing.js";
const mailingManager = new MailingManager();

export default class UserRepository {

    async findByEmail(email) {

        try {

            return UserModel.findOne({ email });
        } catch (error) {
            throw error
        }
    }

    async findById(id) {
        try {
            return await UserModel.findById(id);
        } catch (error) {
            throw error
        }
    }

    async create(user) {
        try {
            return await user.save();
        } catch (error) {
            throw error
        }
    }

    async updateUserRole(userId, newRole) {
        try {
            const user = await UserModel.findById(userId);

            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            const requiredDocs = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const userDocs = user.documents.map(d => d.name);

            const hasRequiredDocs = requiredDocs.every(d => userDocs.include(d));

            if (!hasRequiredDocs) {
                throw new Error('Debes cargar los siguientes documentos:Identificación, Comprobante de domicilio, Comprobante de estado de cuenta')
            }
        } catch (error) {
            throw error
        }
    }

    async getAllUsers() {
        try {
            const _getAll = await UserModel.find({});
            return _getAll
        } catch (error) {
            throw error
        }
    }

    async deleteUserById(uid) {
        try {
            const deleted = await UserModel.findByIdAndDelete(uid);

            if (!deleted) {
                console.log(`El usuario ${uid} no se ha podido borrar correctamente`);
                return null;
            }
            console.log(`El usuario ${uid} elimino correctamente`)



        } catch (error) {
            console.error('Parece que hubo un problema con el elemento que desea eliminar', error)
        }
    }


    async becomePremium(dataUser) {

        const { id, role } = dataUser;
        try {
            const user = await UserModel.findById(id);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }


            const newRole = role;

            const updated = await UserModel.findByIdAndUpdate(id, { role: newRole }, { new: true });

        } catch (error) {
            throw error
        }
    }


    async deleteInactives() {
        try {
            const _aallUsers = await UserModel.find();
            const _now = new Date();

            // calcula el tiempo de inactividad de los usuarios
            const _inactiveUsers = _aallUsers.filter(user => {
                const _lastConnection = new Date(user.last_connection);
                const _diffInHours = (_now - _lastConnection) / (1000 * 60 * 60);
                return _diffInHours > 48;
            })


            //Borra el usuario y su correspondiente carrito
            _inactiveUsers.map(async user => {
                await UserModel.findByIdAndDelete(user.id);
                await cartModel.findByIdAndDelete(user.cart);
                console.log({ message: `Este usuario ${user.id} y su carrito (id:${user.cart}) han sido eliminados.` })
                await mailingManager.sendMailUserDeleted(user.email, user.first_name)
            })


        } catch (error) {
            console.error("Error al intentar borrar al usuario", error);

        }
    }



}
