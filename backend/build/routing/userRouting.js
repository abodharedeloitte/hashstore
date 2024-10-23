"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
exports.generateRandomId = generateRandomId;
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
const model_1 = require("../module/model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_secret_key = 'JWTAuthLogin';
function generateRandomId() {
    const timestamp = Math.floor(Date.now() / 1000);
    const rendomPart = Array.from({ length: 4 }, () => {
        const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return char.charAt(Math.floor(Math.random() * char.length));
    }).join("");
    const randomID = timestamp.toString();
    return rendomPart + randomID;
}
function isValidEmail(email) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@deloitte\.com$/;
    return gmailRegex.test(email);
}
userRouter.post('/register', async (req, res) => {
    try {
        let { name, mobile, emailID, password } = req.body;
        const registeredEmailID = await model_1.userModel.findOne({ emailID: emailID });
        if (registeredEmailID) {
            res.json({ status: 401, message: 'This emailId is already been used' });
            return;
        }
        else {
            if (!isValidEmail(emailID)) {
                res.json({ status: 401, message: 'Please enter the valid emailid' });
                return;
            }
            password = await bcrypt_1.default.hash(password, 10);
            let user_id = generateRandomId();
            let data = { user_id, name, mobile, emailID, password };
            const user = await model_1.userModel.create(data);
            res.json({ status: 200, message: "Registered Successfully", result: user });
        }
    }
    catch (Error) {
        console.log(Error);
        res.json({ status: 500, message: "Registration Failed" });
    }
});
userRouter.post('/login', async (req, res) => {
    try {
        let { emailID, password } = req.body;
        if (!isValidEmail(emailID)) {
            res.json({ status: 401, message: 'Please enter the valid emailid' });
            return;
        }
        const user = await model_1.userModel.find({ emailID });
        if (!user) {
            res.json({ status: 404, message: 'User not found' });
            return;
        }
        const userPassword = user[0]['password'];
        let validPassword = await bcrypt_1.default.compare(password, userPassword);
        if (user && !validPassword) {
            res.json({ status: 403, message: 'Password is incorrect' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ user_id: user[0]['user_id'], emailID: user[0]['emailID'] }, jwt_secret_key, { expiresIn: '1h' });
        console.log("Token", token);
        res.cookie("hashstoretoken", token, { httpOnly: true });
        res.json({ status: 200, message: 'Login Successfully', result: user, token: token });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Login Failed" });
    }
});
userRouter.post('/forgotPassword', async (req, res) => {
    try {
        let { emailID, password } = req.body;
        if (!isValidEmail(emailID)) {
            res.json({ status: 401, message: 'Please enter the valid emailid' });
            return;
        }
        const user = await model_1.userModel.find({ emailID });
        if (!user) {
            res.json({ status: 404, message: 'User not found' });
            return;
        }
        password = await bcrypt_1.default.hash(password, 10);
        const updateUser = await model_1.userModel.updateOne({ emailID: emailID }, { $set: { password: password } });
        res.json({ status: 200, message: 'Password changed', result: updateUser });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to password change" });
    }
});
userRouter.post('/getUserItems', async (req, res) => {
    try {
        console.log(req.body);
        let { user_id } = req.body;
        const user_data = await model_1.userModel.find({ user_id: user_id });
        res.json({ status: 200, message: "Item load successfully", result: user_data });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to get user items" });
    }
});
userRouter.post('/addItemToCard', async (req, res) => {
    try {
        console.log(req.body);
        let { address, payment_mode, quantity } = req.body.form;
        let { user_id, item_id, price } = req.body;
        let status = "Order Received";
        const user = await model_1.userModel.findOneAndUpdate({ user_id: user_id }, {
            $push: {
                purchase_items: {
                    item_id: item_id,
                    shipment_address: address,
                    payment_mode: payment_mode,
                    status: status,
                    quantity: quantity,
                    price: price
                }
            }
        }, { new: true });
        if (!user) {
            res.json({ status: 404, message: "User not found" });
            return;
        }
        res.json({ status: 200, message: "Item added successfully", result: user });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to add item" });
    }
});
userRouter.post('/removeItemFromCard', async (req, res) => {
    try {
        let { user_id, item_id } = req.body;
        const user = await model_1.userModel.findOneAndUpdate({ user_id: user_id }, {
            $pull: {
                purchase_items: {
                    item_id: item_id,
                }
            }
        }, { new: true });
        if (!user) {
            res.json({ status: 404, message: "User not found" });
            return;
        }
        res.json({ status: 200, message: "Item remove successfully", result: user });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to remove item" });
    }
});
userRouter.delete('/deleteUserAccount', async (req, res) => {
    try {
        let { user_id } = req.body;
        await model_1.userModel.deleteOne({ user_id: user_id });
        res.json({ status: 200, message: "User delete successfully" });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to delete user" });
    }
});
