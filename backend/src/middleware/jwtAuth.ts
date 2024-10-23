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
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            let token = req.headers.authorization.split('')[1];
            console.log(token);
            const user = jwt.verify(token, jwt_secret_key);
            console.log(token);
            req.user = user;
        }
        // const token = req.cookies.hashstoretoken;
        // console.log("cookies",req.cookies);
        // const token = localStorage.getItem('hashstoretoken');
        next();
    } catch (error) {
        console.log("JWT error", error)
        res.clearCookie("hashstoretoken")
        return res.redirect('/user/login');
        // return res.status(401).json({ message: 'Invalid Token' });
    }
}

export { cookieJWTAuth }