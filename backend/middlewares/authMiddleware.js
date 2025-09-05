import jwt from "jsonwebtoken"
import asyncHandler from "./asyncHandler.js"
import ErrorResponse from "../utils/ErrorResponse.js"
import { findUserByEmail } from "../models/userModel.js"

const authMiddleware = asyncHandler(async(req, res, next) => {
    let token;
    // Get token from headers (Authorization: Bearer <TOKEN>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract token
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized, no token', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB using email stored in token
        const user = await findUserByEmail(decoded.email);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        return next(new ErrorResponse('Not authorized, invalid token', 401));
    }
})

export default authMiddleware;