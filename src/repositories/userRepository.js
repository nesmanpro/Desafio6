import UserModel from "../models/user.model.js";

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


    async becomePremium(uid, role) {

        try {
            const user = await userRepo.findById(uid);

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }


            const newRole = role;

            const updated = await UserModel.findByIdAndUpdate(uid, { role: newRole }, { new: true });

        } catch (error) {
            throw error
        }
    }



}
