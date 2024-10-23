"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
const express_1 = __importDefault(require("express"));
const transactionRouter = express_1.default.Router();
exports.transactionRouter = transactionRouter;
const model_1 = require("../module/model");
const jwtAuth_1 = require("../middleware/jwtAuth");
function generateTransactionId() {
    const timestamp = Math.floor(Date.now() / 1000);
    const rendomPart = Array.from({ length: 6 }, () => {
        const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return char.charAt(Math.floor(Math.random() * char.length));
    }).join("");
    const randomID = timestamp.toString();
    return rendomPart + randomID;
}
transactionRouter.post('/generateTransaction', jwtAuth_1.cookieJWTAuth, async (req, res) => {
    try {
        let transaction_id = generateTransactionId();
        let { user_id, item_id, amount, payment_mode, paymentType, type } = req.body;
        const transaction = await model_1.transactionModel.insertMany({ transaction_id, user_id, item_id, amount, payment_mode, paymentType, transaction_date: new Date(), type: type });
        const updatePurschaseItem = await model_1.userModel.updateOne({ user_id: user_id, "purchase_items.item_id": item_id }, { $set: { "purchase_items.$.payment_status": true } });
        res.json({ status: 200, message: "Transaction Successfully", result: transaction });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Transaction failed" });
    }
});
transactionRouter.get('/getTransaction', jwtAuth_1.cookieJWTAuth, async (req, res) => {
    try {
        let { user_id } = req.body;
        const transaction = await model_1.transactionModel.find({ user_id: user_id });
        res.json({ status: 200, message: "Transaction Successfully", result: transaction });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Transaction failed" });
    }
});
