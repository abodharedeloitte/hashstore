"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sellerSchema = new mongoose_1.Schema({
    seller_id: {
        type: String,
        unique: true
    },
    user_id: {
        type: String
    },
    item_id: [
        { type: String }
    ],
    added_as_seller_date: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    status: {
        type: Boolean
    }
}, { timestamps: true });
exports.default = sellerSchema;
