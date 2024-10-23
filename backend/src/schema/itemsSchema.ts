import mongoose, { Schema, Document } from "mongoose";


const itemsSchema: Schema = new Schema({
    item_id: {
        type: String,
        unique: true
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
    price: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        require: true
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


export default itemsSchema;