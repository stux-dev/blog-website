import { Router } from "express";
import { createBlog } from "../controllers/blogController.js";

const router = Router();


router.get("/create", createBlog);

export default router;