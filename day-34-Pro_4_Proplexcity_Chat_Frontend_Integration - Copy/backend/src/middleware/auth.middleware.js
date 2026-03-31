import { BlacklistTokenModel } from "../models/blacklist_token.model.js";
import jwt from "jsonwebtoken";

export async function identifyUser(req, res, next) {
    const token = req.cookies.token;
    
    if(!token){
        const error = new Error("Token is missign");
        error.status = 401;
        error.stack = "Provide valid token"
        return next(error)
    }

    try {
        const isTokenBlacklisted = await BlacklistTokenModel.findOne({
            token,
        })

        if(isTokenBlacklisted){
            const error = new Error("Unauthorized Access");
            error.status = 401;
            error.stack = "Token is blacklisted. Please login again.";
            return next(error);
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        const err = new Error("Unauthorized Access");
        err.status = 401;
        err.stack = error;
        return next(err);
    }
}