import { Router } from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, getBlogBySlug, updateBlog, getDailyViewsForUser, getUserInfo, getAllBlogsForUser } from "../controllers/blogController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = Router();


router.post("/new", authMiddleware ,createBlog);
router.patch("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);
router.get("/blogs", getAllBlogs);
router.get("/id/:id", getBlogById);
router.get("/d/stats/:userId", getDailyViewsForUser);
router.get("/d/userinfo/:userId", getUserInfo);
router.get("/d/blogs/:userId", getAllBlogsForUser);

// Static before Dynamic bcz of the waterfall method
router.get("/:slug", getBlogBySlug);


export default router;