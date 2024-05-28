
import { UserModel } from "../models/user.model";

export default class UserRepository {
    async findByEmail(email) {
        return UserModel.findOne({ email });
    }
}
