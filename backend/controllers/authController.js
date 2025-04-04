import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { createUser, findUserByEmail } from "../models/userModel.js";
import redis from "redis";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import sendMail from "../utils/sendMail.js";

const client = redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

export const registerUser = asyncHandler(async (req, res, next) => {
    const user = req.body;
    /*
    
    user = {
        first_name,
        last_name,
        dob,
        email,
        password,
    }

    */

    const existingUser = await findUserByEmail(user.email);
    if (existingUser) {
        return next(new ErrorResponse("User already Exists", 400));
    }

    user.password = await bcrypt.hash(
        user.password,
        parseInt(process.env.SALT_ROUNDS)
    );

    const generateOTP = () =>
        Math.floor(100000 + Math.random() * 900000).toString();

    const otp = generateOTP();
    await sendMail(user.email, user.first_name, otp);

    user.otp = await bcrypt.hash(otp, parseInt(process.env.SALT_ROUNDS));
    await client.setEx(user.email, 300, JSON.stringify(user));

    res.status(200).json({
        success: true,
        message: "Email sent succesfully",
    });
});

export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = existingUser.password;

    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ email });

    res.status(200).json({ success: true, message: "Login successful", token });
});

export const verifyOtp = asyncHandler(async (req, res, next) => {
    const user = req.body;

    const otpData = await client.get(user.email);
    if (!otpData)
        return res
            .status(400)
            .json({ message: "OTP expired or not requested!" });

    const userData = JSON.parse(otpData);

    const isOtpValid = await bcrypt.compare(user.otp, userData.otp);
    if (!isOtpValid) return res.status(400).json({ message: "Invalid OTP!" });

    await createUser(userData);

    const token = generateToken({ email: userData.email });
    await client.del(userData.email);

    res.status(201).json({
        message: "OTP verified! User registered successfully.",
        token,
    });
});
