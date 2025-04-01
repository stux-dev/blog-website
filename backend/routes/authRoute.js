import { Router } from "express";
import { registerUser , loginUser} from "../controllers/authController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp")


export default router;