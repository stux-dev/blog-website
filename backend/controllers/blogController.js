import asyncHandler from "../middlewares/asyncHandler.js";
import { findUserById } from "../models/userModel.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { createBlog as createBlogPostInDb, getAllBlogs as getAllBlogInDb, getBlogBySlug as getBlogBySlugInDb } from "../models/blogModel.js";
import { raw } from "express";

export const createBlog = asyncHandler(async (req, res, next) => {
    const blogData = req.body;
    /* 
    blogData = {
        "user_id",
        "title",
        "slug",
        "content",
        "status"
    }
    
    */

    const exists = await findUserById(blogData.user_id);
    if(!exists){
        return next(new ErrorResponse("User Not Exists", 404))
    }

    const blogId = await createBlogPostInDb(blogData);

    if(!blogId){
        return next(new ErrorResponse("Could not create the blog due to a server error.", 500));
    }

    res.status(200).json({
        message : "Blog Created Successfully",
        blogId
    })
    
})

export const getAllBlogs = asyncHandler( async (req, res, next) => {
    const blogData = await getAllBlogInDb();

    if(!blogData){
        return next(new ErrorResponse("Failed to fetch blogs due to server error.", 500));
    }

    res.status(200).json({
        blogData
    })
})

export const getBlogBySlug = asyncHandler(async (req, res, next) => {
    const slug = req.params.slug;
    
    const blog = await getBlogBySlugInDb(slug);

    if (!blog) {
            return next(new ErrorResponse(`Blog not found with slug: ${slug}`, 404));
    }

    res.status(200).json(blog);
})