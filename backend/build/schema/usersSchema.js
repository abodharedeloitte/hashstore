"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    user_id: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    emailID: {
        type: String,
        require: true
    },
    mobile: {
        type: Number
    },
    password: {
        type: String,
        require: true
    },
    purchase_items: [
        {
            item_id: {
                type: String
            },
            shipment_address: {
                type: String
            },
            payment_mode: {
                type: String,
                enum: ['Online', 'Cash On Delivary']
            },
            status: {
                type: String,
                enum: ['Order Received', 'Pickup', 'Reached at destination city', 'Deliverd']
            },
            quantity: {
                type: Number,
            },
            price: {
                type: Number
            },
            payment_status: {
                type: Boolean,
            }
        }
    ]
}, { timestamps: true });
exports.default = userSchema;
