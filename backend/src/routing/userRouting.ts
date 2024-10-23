import express from "express";
const userRouter = express.Router();
import { userModel } from "../module/model";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const jwt_secret_key = 'JWTAuthLogin'
import { cookieJWTAuth } from "../middleware/jwtAuth";


function generateRandomId(): string {
    const timestamp = Math.floor(Date.now() / 1000);
    const rendomPart = Array.from({ length: 4 }, () => {
        const char = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return char.charAt(Math.floor(Math.random() * char.length));
    }).join("");
    const randomID = timestamp.toString();
    return rendomPart + randomID;
}

function isValidEmail(email: string): boolean {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@deloitte\.com$/;
    return gmailRegex.test(email);
}

userRouter.post('/register', async (req, res) => {
    try {
        let { name, mobile, emailID, password } = req.body;
        const registeredEmailID = await userModel.findOne({ emailID: emailID });
        if (registeredEmailID) {
            res.json({ status: 401, message: 'This emailId is already been used' });
            return
        } else {
            if (!isValidEmail(emailID)) {
                res.json({ status: 401, message: 'Please enter the valid emailid' });
                return
            }

            password = await bcrypt.hash(password, 10)

            let user_id = generateRandomId();
            let data = { user_id, name, mobile, emailID, password };

            const user = await userModel.create(data);

            res.json({ status: 200, message: "Registered Successfully", result: user });
        }
    } catch (Error) {
        console.log(Error);
        res.json({ status: 500, message: "Registration Failed" });
    }
})

userRouter.post('/login', async (req, res) => {
    try {
        let { emailID, password } = req.body;
        if (!isValidEmail(emailID)) {
            res.json({ status: 401, message: 'Please enter the valid emailid' });
            return
        }

        const user = await userModel.find({ emailID });

        if (!user) {
            res.json({ status: 404, message: 'User not found' });
            return;
        }

        const userPassword = user[0]['password'] as string;
        let validPassword = await bcrypt.compare(password, userPassword)

        if (user && !validPassword) {
            res.json({ status: 403, message: 'Password is incorrect' });
            return;
        }

        const token = jwt.sign({ user_id: user[0]['user_id'], emailID: user[0]['emailID'] }, jwt_secret_key, { expiresIn: '1h' });

        console.log("Token", token)
        res.cookie("hashstoretoken", token, { httpOnly: true });

        res.json({ status: 200, message: 'Login Successfully', result: user, token: token });
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Login Failed" });
    }
})

userRouter.post('/forgotPassword', async (req, res) => {
    try {
        let { emailID, password } = req.body;
        if (!isValidEmail(emailID)) {
            res.json({ status: 401, message: 'Please enter the valid emailid' });
            return
        }
        const user = await userModel.find({ emailID });
        if (!user) {
            res.json({ status: 404, message: 'User not found' });
            return;
        }
        password = await bcrypt.hash(password, 10);
        const updateUser = await userModel.updateOne({ emailID: emailID }, { $set: { password: password } });
        res.json({ status: 200, message: 'Password changed', result: updateUser });
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to password change" });
    }
})

userRouter.post('/getUserItems', async (req, res) => {
    try {
        console.log(req.body)
        let { user_id } = req.body;
        const user_data = await userModel.find({ user_id: user_id });
        res.json({ status: 200, message: "Item load successfully", result: user_data })
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to get user items" })
    }
})


userRouter.post('/addItemToCard', async (req, res) => {
    try {
        console.log(req.body);
        let { address, payment_mode, quantity } = req.body.form;
        let { user_id, item_id, price } = req.body;
        let status = "Order Received";

        const user = await userModel.findOneAndUpdate(
            { user_id: user_id },
            {
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
            }, { new: true }
        )
        if (!user) {
            res.json({ status: 404, message: "User not found" });
            return;
        }
        res.json({ status: 200, message: "Item added successfully", result: user })
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to add item" })
    }
})

userRouter.post('/removeItemFromCard', async (req, res) => {
    try {
        let { user_id, item_id } = req.body;

        const user = await userModel.findOneAndUpdate(
            { user_id: user_id },
            {
                $pull: {
                    purchase_items: {
                        item_id: item_id,
                    }
                }
            }, { new: true }
        )
        if (!user) {
            res.json({ status: 404, message: "User not found" });
            return;
        }
        res.json({ status: 200, message: "Item remove successfully", result: user })
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to remove item" })
    }
})

userRouter.delete('/deleteUserAccount', async (req, res) => {
    try {
        let { user_id } = req.body
        await userModel.deleteOne({ user_id: user_id });
        res.json({ status: 200, message: "User delete successfully" });
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to delete user" });
    }
})

export { userRouter, generateRandomId };