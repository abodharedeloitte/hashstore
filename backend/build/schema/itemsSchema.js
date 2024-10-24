"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const itemsSchema = new mongoose_1.Schema({
    item_id: {
        type: String,
        unique: true
    },
    user_id: {
        type: String,
        require: true
    },
    category: {
        type: String,
        enum: ['Mobile', 'Home & Kitchen', 'Electronics', 'Grocery']
    },
    name: {
        type: String,
        require: true
    },
    desc: {
        type: String
    },
    img: {
        type: String
    },
    type: {
        type: String,
        enum: ['buy', 'sell', 'trade'],
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        require: true
    },
    selled_quantity: {
        type: Number,
        require: true,
        default: 0
    },
    status: {
        type: Boolean,
    },
    item_rating: {
        user_id: String,
        rating: Number,
        time: Date,
        comment: String
    },
    added_date: {
        type: Date
    },
    updated_date: {
        type: Date
    },
}, { timestamps: true });
exports.default = itemsSchema;
