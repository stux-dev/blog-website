import asyncHandler from "../middlewares/asyncHandler.js";
import { findUserById } from "../models/userModel.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { createBlog as createBlogPostInDb, getAllBlogsForUser as getAllBlogsForUserInDb ,getUserInfo as getUserInfoInDb, getAllBlogs as getAllBlogInDb, getBlogBySlug as getBlogBySlugInDb , updateBlog as updateBlogInDb, deleteBlogById as deleteBlogByIdInDb, getDailyViewsForUser as getDailyViewsForUserInDb} from "../models/blogModel.js";


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
        slug: blogId.slug
    })
    
})

export const getAllBlogsForUser = asyncHandler( async (req, res, next) => {
   
    const { userId } = req.params;

    const blogData = await getAllBlogsForUserInDb(userId);

    if(!blogData){
        return next(new ErrorResponse("Failed to fetch blogs for this user.", 500));
    }

    res.status(200).json({
        blogData
    });
});

export const updateBlog = asyncHandler( async(req, res, next) =>{
    const blogData = req.body;
    const blogSlug = req.params.id;
    const userId = req.user?.id;
    

    const rowsAffected = await updateBlogInDb(userId,blogSlug, blogData);

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
        slug : blogData.slug
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



export const getDailyViewsForUser = asyncHandler(async (req, res, next)=>{
    const userId = req.params.userId;

    const data = await getDailyViewsForUserInDb(userId);

    if(!data){
        return next(new ErrorResponse(`Error fetching data in DB`, 500))
    }

    res.status(200).json({
        message:"success",
        dailyStats : data
    })
})

export const getUserInfo = asyncHandler(async (req, res, next)=>{
    const userId = req.params.userId;

    const userInfo = await getUserInfoInDb(userId);

    if(!userInfo){
        return next(new ErrorResponse(`Error fetching userInfo in DB`, 500))
    }

    res.status(200).json({
        message:"success",
        userInfo
    })

})
