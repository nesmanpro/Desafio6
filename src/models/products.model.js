
import mongoose from "mongoose";

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
        required: false
    },
    owner: {
        type: String,
        required: true,
        default: 'admin'
    }

});




const prodModel = mongoose.model('Product', prodsSchema);

export default prodModel;