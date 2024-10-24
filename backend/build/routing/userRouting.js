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
const jwtAuth_1 = require("../middleware/jwtAuth");
const joi_1 = __importDefault(require("joi"));
// register validation
const registerSchema = joi_1.default.object({
    name: joi_1.default.string().required().messages({
        'string.empty': 'Name is required',
    }),
    mobile: joi_1.default.string().pattern(/^[0-9]+$/).required().messages({
        'string.empty': 'Mobile number is required',
        'string.pattern.base': 'Invalid mobile number',
    }),
    emailID: joi_1.default.string().email().required().custom((value, helpers) => {
        if (!value.endsWith('@deloitte.com')) {
            return helpers.message({ custom: 'Email must be a @deloitte.com address' });
        }
        return value;
    }).messages({
        'string.empty': 'Email is required',
        'string.email': 'Invalid email address',
    }),
    password: joi_1.default.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
    }),
});
const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => ({
            message: detail.message,
            path: detail.path,
        }));
        return res.status(400).json({ status: 400, errors });
    }
    next();
};
// add items to card validation
const addItemToCardSchema = joi_1.default.object({
    address: joi_1.default.string().required().messages({
        'string.empty': 'Address is required',
    }),
    payment_mode: joi_1.default.string().valid('Online', 'Cash On Delivary').required().messages({
        'string.empty': 'Payment mode is required',
        'any.only': 'Payment mode must be one of [Online , Cash On Delivery]',
    }),
    quantity: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity must be at least 1',
        'any.required': 'Quantity is required',
    }),
    user_id: joi_1.default.string().required().messages({
        'string.empty': 'User ID is required',
    }),
    item_id: joi_1.default.string().required().messages({
        'string.empty': 'Item ID is required',
    }),
    price: joi_1.default.number().positive().required().messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be a positive number',
        'any.required': 'Price is required',
    }),
});
const validateAddItemToCard = (req, res, next) => {
    const { error } = addItemToCardSchema.validate(Object.assign(Object.assign({}, req.body), req.body.form), { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => ({
            message: detail.message,
            path: detail.path,
        }));
        return res.status(400).json({ status: 400, errors });
    }
    next();
};
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
userRouter.post('/register', validateRegister, async (req, res) => {
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
        const user = await model_1.userModel.find({ emailID: emailID });
        if (user.length == 0) {
            res.json({ status: 404, message: 'User not found' });
            return;
        }
        else {
            const userPassword = user[0]['password'];
            let validPassword = await bcrypt_1.default.compare(password, userPassword);
            if (user && !validPassword) {
                res.json({ status: 403, message: 'Password is incorrect' });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ user_id: user[0]['user_id'], emailID: user[0]['emailID'] }, jwt_secret_key, { expiresIn: '1h' });
            console.log("Token", token);
            res.json({ status: 200, message: 'Login Successfully', result: user, token: token });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Login Failed" });
    }
});
userRouter.post('/forgotPassword', jwtAuth_1.cookieJWTAuth, async (req, res) => {
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
userRouter.post('/getUserItems', jwtAuth_1.cookieJWTAuth, async (req, res) => {
    try {
        let { user_id } = req.body;
        const user_data = await model_1.userModel.find({ user_id: user_id });
        res.json({ status: 200, message: "Item load successfully", result: user_data });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to get user items" });
    }
});
userRouter.post('/addItemToCard', jwtAuth_1.cookieJWTAuth, async (req, res) => {
    try {
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
                    price: price,
                    payment_status: payment_mode == 'Cash On Delivary' ? false : true
                }
            }
        }, { new: true });
        if (!user) {
            res.json({ status: 404, message: "User not found" });
            return;
        }
        await model_1.itemModel.updateOne({ item_id: item_id }, { $inc: { selled_quantity: quantity } });
        res.json({ status: 200, message: "Item added successfully", result: user });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to add item" });
    }
});
userRouter.post('/removeItemFromCard', jwtAuth_1.cookieJWTAuth, async (req, res) => {
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
userRouter.delete('/deleteUserAccount', jwtAuth_1.cookieJWTAuth, async (req, res) => {
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
