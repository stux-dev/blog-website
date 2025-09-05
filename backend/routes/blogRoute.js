import { Router } from "express";
import { createBlog, getAllBlogs, getBlogBySlug } from "../controllers/blogController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();


router.post("/create", authMiddleware ,createBlog);
router.get("/blogs", getAllBlogs);

// Static before Dynamic bcz of the waterfall method
router.get("/:slug", getBlogBySlug);


export default router;