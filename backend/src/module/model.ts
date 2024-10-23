import mongoose from "mongoose";
import userSchema from "../schema/usersSchema";
import itemsSchema from "../schema/itemsSchema";
import transactionSchema from "../schema/transactionSchema";

const userModel = mongoose.model('users', userSchema);
const itemModel = mongoose.model('items', itemsSchema);
const transactionModel = mongoose.model('transaction', transactionSchema);

export { userModel, itemModel, transactionModel }