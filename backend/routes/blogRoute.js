import { Router } from "express";
import { createBlog, getAllBlogs, getBlogBySlug } from "../controllers/blogController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();


router.post("/create", authMiddleware ,createBlog);
router.get("/:slug", getBlogBySlug);
router.get("/blogs", getAllBlogs);


export default router;