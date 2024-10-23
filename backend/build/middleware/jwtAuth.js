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
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            let token = req.headers.authorization.split('')[1];
            console.log(token);
            const user = jsonwebtoken_1.default.verify(token, jwt_secret_key);
            console.log(token);
            req.user = user;
        }
        // const token = req.cookies.hashstoretoken;
        // console.log("cookies",req.cookies);
        // const token = localStorage.getItem('hashstoretoken');
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
