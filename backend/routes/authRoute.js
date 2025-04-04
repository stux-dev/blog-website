import { Router } from "express";
import { registerUser , loginUser, verifyOtp} from "../controllers/authController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp)


export default router;