const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    email: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    password: String,
    age: Number,
    role: {
        type: String,
        default: 'User'
    }

});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;