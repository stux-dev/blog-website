import asyncHandler from "../middlewares/asyncHandler.js";
import { findUserById } from "../models/userModel.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { createBlog as createBlogPostInDb, getAllBlogs as getAllBlogInDb, getBlogBySlug as getBlogBySlugInDb , getBlogById as getBlogByIdInDb, updateBlog as updateBlogInDb, deleteBlogById as deleteBlogByIdInDb} from "../models/blogModel.js";


export const createBlog = asyncHandler(async (req, res, next) => {
    const blogData = req.body;
    const user_id = req.user?.id;
    /* 
    blogData = {

        "title",
        "slug",
        "content",
        "status"
    }
    
    */

    const exists = await findUserById(user_id);
    if(!exists){
        return next(new ErrorResponse("User Not Exists", 404))
    }

    const blogId = await createBlogPostInDb(user_id, blogData);

    if(!blogId){
        return next(new ErrorResponse("Could not create the blog due to a server error.", 500));
    }

    res.status(200).json({
        message : "Blog Created Successfully",
        blogId
    })
    
})


export const updateBlog = asyncHandler( async(req, res, next) =>{
    const blogData = req.body;
    const blogId = req.params.id;
    const userId = req.user?.id;
    

    const rowsAffected = await updateBlogInDb(userId,blogId, blogData);

    if(!rowsAffected){
        return next(new ErrorResponse("Could not update the blog due to a server error.", 500));
    }
    if (rowsAffected === 0) {
            // This means the blog wasn't found OR the user doesn't own it.
            // Returning 404 is a good security practice as it doesn't reveal
            // that the blog exists to an unauthorized user.
            return res.status(404).json({ message: "Blog not found or you don't have permission to edit it." });
        }

    res.status(200).json({
        message : "Blog Updated Successfully",
        blogId : {
            id : blogId,
            slug : blogData.slug
        }
    })
})

export const deleteBlog = asyncHandler(async (req, res, next)=>{
    const {id} = req.params;
    const user_id = req.user?.id;



    if (!user_id) {
            return res.status(401).json({ message: "Unauthorized. You must be logged in to delete a post." });
    }
    
    const rowsAffected = await deleteBlogByIdInDb(id , user_id);

    if (rowsAffected === 0) {
            // This handles two cases:
            // a) The blog post with that ID doesn't exist.
            // b) The blog post exists, but it doesn't belong to the logged-in user.
            // Sending a 404 is a secure way to handle both without leaking information.
            return res.status(404).json({ message: "Blog not found or you do not have permission to delete it." });
        }

        // 5. If successful, send a confirmation response.
    return res.status(200).json({ message: "Blog deleted successfully." });

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

export const getBlogById = asyncHandler(async (req, res, next) => {
    const blogId = req.params.id;
    
    const blog = await getBlogByIdInDb(blogId);

    if (!blog) {
            return next(new ErrorResponse(`Blog not found with blogId: ${blogId}`, 404));
    }

    res.status(200).json(blog);
})