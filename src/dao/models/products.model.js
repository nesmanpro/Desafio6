const mongoose = require('mongoose');
const Paginate = require("mongoose-paginate-v2")

const prodsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
    },
    thumbnail: {
        type: [String],
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },


});

prodsSchema.plugin(Paginate);


const prodModel = mongoose.model('Product', prodsSchema);

module.exports = prodModel;