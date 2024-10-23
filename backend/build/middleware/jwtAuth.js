"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieJWTAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_secret_key = 'JWTAuthLogin';
const cookieJWTAuth = (req, res, next) => {
    try {
        const token = req.cookies.hashstoretoken;
        const user = jsonwebtoken_1.default.verify(token, jwt_secret_key);
        console.log(user);
        req.user = user;
        next();
    }
    catch (error) {
        console.log("JWT error", error);
        res.clearCookie("hashstoretoken");
        return res.redirect('/user/login');
        // return res.status(401).json({ message: 'Invalid Token' });
    }
};
exports.cookieJWTAuth = cookieJWTAuth;
