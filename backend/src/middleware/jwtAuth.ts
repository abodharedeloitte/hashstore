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
        console.log("Auth called")
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            let token = req.headers.authorization.split(" ")[1];
            const user = jwt.verify(token, jwt_secret_key);
            req.user = user;
        }
        next();
    } catch (error) {
        res.json({ status: 401, message: 'Not Authorized, please login' });
        // return res.status(401).json({ message: 'Invalid Token' });
        return res.redirect('/user/login');
    }
}


// const cookieJWTAuth = (req: Request, res: Response, next: NextFunction) => {
//     console.log("Auth called", req.headers.authorization);
//     if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//         try {
//             let token = req.headers.authorization.split(" ")[1];
//             const user = jwt.verify(token, jwt_secret_key);
//             console.log(token);
//             req.user = user;
//             // const token = req.cookies.hashstoretoken;
//             // console.log("cookies",req.cookies);
//             // const token = localStorage.getItem('hashstoretoken');
//             next();
//         }
//         catch (error) {
//             // console.log("JWT error", error)
//             // res.json()
//             res.status(401).json({ message: 'Invalid Token' });
//             return res.redirect('/user/login');
//         }
//     } else {
//         res.json({ status: 401, message: 'Not Authorized, plase login' });
//         return res.redirect('/user/login');
//     }
// }

export { cookieJWTAuth }