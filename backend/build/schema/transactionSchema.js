"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
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
exports.default = transactionSchema;
