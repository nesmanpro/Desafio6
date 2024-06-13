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

}
