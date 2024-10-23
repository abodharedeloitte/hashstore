import express from "express";
const transactionRouter = express.Router();
import { transactionModel, userModel } from "../module/model";
import { cookieJWTAuth } from "../middleware/jwtAuth";


function generateTransactionId(): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const rendomPart = Array.from({ length: 6 }, () => {
        const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return char.charAt(Math.floor(Math.random() * char.length));
    }).join("");
    const randomID = timestamp.toString();
    return rendomPart + randomID;
}


transactionRouter.post('/generateTransaction', cookieJWTAuth, async (req, res) => {
    try {
        let transaction_id = generateTransactionId();
        let { user_id, item_id, amount, payment_mode, paymentType, type } = req.body
        const transaction = await transactionModel.insertMany({ transaction_id, user_id, item_id, amount, payment_mode, paymentType, transaction_date: new Date(), type: type });
        const updatePurschaseItem = await userModel.updateOne({ user_id: user_id, "purchase_items.item_id": item_id }, { $set: { "purchase_items.$.payment_status": true } })
        res.json({ status: 200, message: "Transaction Successfully", result: transaction })
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Transaction failed" });
    }
})

transactionRouter.get('/getTransaction', cookieJWTAuth, async (req, res) => {
    try {
        let { user_id } = req.body
        const transaction = await transactionModel.find({ user_id: user_id });
        res.json({ status: 200, message: "Transaction Successfully", result: transaction })
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Transaction failed" });
    }
})

export { transactionRouter }