import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import {createUser, findUserByEmail} from "../models/userModel.js";
import redis from "redis";
import { generateToken } from "../utils/jwt.js";


const client = redis.createClient({ url : process.env.REDIS_URL })
client.connect().catch(console.error)   

export const registerUser = asyncHandler( async(req, res, next) => {
    const user = req.body;

    const existingUser = await findUserByEmail(user.email);
    if (existingUser) {
        return next(new ErrorResponse('User already Exists', 400));
    }

    await createUser(user);
    res.status(201).json({
        success : true,
        message :  'User registered successfully',
    });

})


export const loginUser = asyncHandler( async(req, res, next) => {
    const user = req.body;
    
    const existingUser = await findUserByEmail(user.email);


    if(!existingUser || existingUser.password !== user.password){
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const token = generateToken(user);
    
    res.json({ success: true, message: 'Login successful' , token, existingUser});

})

export const verifyOtp = asyncHandler(async(req, res, next) => {
    
})
