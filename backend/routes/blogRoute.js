import { Router } from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, getBlogBySlug, updateBlog } from "../controllers/blogController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();


router.post("/new", authMiddleware ,createBlog);
router.patch("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);
router.get("/blogs", getAllBlogs);
router.get("/id/:id", getBlogById);

// Static before Dynamic bcz of the waterfall method
router.get("/:slug", getBlogBySlug);


export default router;