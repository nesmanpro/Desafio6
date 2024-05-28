
import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    purchase_datetime: {
        type: Date,
        default: Date.now,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: mongoose.Schema.Types.String,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
    },
    products: {
        type: Object,
    },
    not_available: {
        type: Object,
    }
});

const TicketModel = mongoose.model('ticket', ticketSchema);

export default TicketModel;