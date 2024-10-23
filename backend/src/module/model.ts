import mongoose from "mongoose";
import userSchema from "../schema/usersSchema";
import itemsSchema from "../schema/itemsSchema";
import sellerSchema from "../schema/sellerSchema";
import transactionSchema from "../schema/transactionSchema";

const userModel = mongoose.model('users', userSchema);
const itemModel = mongoose.model('items', itemsSchema);
const sellerModel = mongoose.model('seller', sellerSchema);
const transactionModel = mongoose.model('transaction', transactionSchema);

export { userModel, itemModel, sellerModel, transactionModel }