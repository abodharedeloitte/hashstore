import mongoose, { Schema, Document } from "mongoose";


const transactionSchema: Schema = new Schema({
    transaction_id: {
        type: String,
        unique: true
    },
    user_id: {
        type: String,
        require: true
    },
    item_id: {
        type: String,
        require: true
    },
    type: {
        type: String,
        enum: ['buy', 'sell', 'trade'],
        required: true
    },
    amount: {
        type: Number
    },
    payment_mode: {
        type: String,
        require: true,
        enum: ['Online', 'Cash On Delivary']
    },
    paymentType: {
        type: String,
        enum: ["Settlement", "Refund Payment"],
    },
    transaction_date: {
        type: Date
    }
}, { timestamps: true });


export default transactionSchema;