const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    product: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
})

const cartModel = mongoose.model("carts", cartSchema);

module.exports = cartModel; 