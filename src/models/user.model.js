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
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }

});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;