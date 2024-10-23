import mongoose, { Schema, Document } from "mongoose";


const sellerSchema: Schema = new Schema({
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


export default sellerSchema;