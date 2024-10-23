import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const jwt_secret_key = 'JWTAuthLogin'


declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }
}

const cookieJWTAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.hashstoretoken;
        const user = jwt.verify(token, jwt_secret_key);
        console.log(user);
        req.user = user;
        next();
    } catch (error) {
        console.log("JWT error",error)
        res.clearCookie("hashstoretoken")
        return res.redirect('/user/login');
        // return res.status(401).json({ message: 'Invalid Token' });
    }
}

export { cookieJWTAuth }