import UserModel from "../models/user.model.js";

export default class UserRepository {

    async findByEmail(email) {
        return UserModel.findOne({ email });
    }

}
