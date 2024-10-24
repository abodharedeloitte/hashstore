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
            let token = req.headers.authorization.split(" ")[1];
            const user = jsonwebtoken_1.default.verify(token, jwt_secret_key);
            req.user = user;
        }
        next();
    }
    catch (error) {
        res.json({ status: 401, message: 'Not Authorized, please login' });
        // return res.status(401).json({ message: 'Invalid Token' });
        return res.redirect('/user/login');
    }
};
exports.cookieJWTAuth = cookieJWTAuth;
