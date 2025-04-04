import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import {createUser, findUserByEmail} from "../models/userModel.js";
import redis from "redis";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcrypt"
import sendMail from "../utils/sendMail.js";


const client = redis.createClient({ url : process.env.REDIS_URL })
client.connect().catch(console.error)   



export const registerUser = asyncHandler( async(req, res, next) => {
    const user = req.body;

    
    const existingUser = await findUserByEmail(user.email);
    if (existingUser) {
        return next(new ErrorResponse('User already Exists', 400));
    }
    
    user.password = await bcrypt.hash(user.password, parseInt(process.env.SALT_ROUNDS))

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
    
    const otp = generateOTP();
    await sendMail(user.email, user.first_name, otp)


    user.otp = await bcrypt.hash(otp, parseInt(process.env.SALT_ROUNDS))
    await client.setEx(user.email, 300, JSON.stringify(user))

    res.status(200).json({
        success : true,
        message : "Email sent succesfully"
    })

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
