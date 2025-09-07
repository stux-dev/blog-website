import db from "../config/db.js";  

export const createBlog = async(userId, blogData) => {

    const status = blogData.status || 'draft';
    const insertedBlog = await db.execute({
        sql:`INSERT INTO blogs (user_id, title, slug, content, status) 
            VALUES (?, ?, ?, ?, ?) 
            RETURNING id, slug`,
        args:[
            userId, 
            blogData.title, 
            blogData.slug, 
            blogData.content, 
            status
        ],
    });

    return insertedBlog.rows[0];
}
export const updateBlog = async(userId, blogId, blogData) => {

    // Construct the SET part of the query dynamically
    // to only update fields that are actually provided.
    const fieldsToUpdate = {};
    if (blogData.title) fieldsToUpdate.title = blogData.title;
    if (blogData.slug) fieldsToUpdate.slug = blogData.slug;
    if (blogData.content) fieldsToUpdate.content = blogData.content;
    if (blogData.status) fieldsToUpdate.status = blogData.status;

    // If there's nothing to update, we can return early.
    if (Object.keys(fieldsToUpdate).length === 0) {
        return 0;
    }
    
    // Add the automatically managed updated_at field
    fieldsToUpdate.updated_at = "strftime('%s', 'now')";

    const setClauses = Object.keys(fieldsToUpdate)
        .map(key => `${key} = ${key === 'updated_at' ? fieldsToUpdate[key] : '?'}`)
        .join(', ');
        
    const args = Object.entries(fieldsToUpdate)
        .filter(([key]) => key !== 'updated_at')
        .map(([, value]) => value);

    // Add the id and user_id for the WHERE clause to the end of the args array
    args.push(blogId, userId);
    
    const updatedBlog = await db.execute({
        sql: `UPDATE blogs 
              SET ${setClauses} 
              WHERE id = ? AND user_id = ?`,
        args: args,
    });

    // Return the number of rows affected. 
    // This will be 1 if the update was successful, and 0 otherwise.
    return updatedBlog.rowsAffected;
}

export const deleteBlogById = async(id, user_id) => {
    if (!id || !user_id) {
        throw new Error("Both blog ID and user ID must be provided to delete a post.");
    }

    const deletedBlog = await db.execute({
        sql: `DELETE FROM blogs WHERE id = ? AND user_id = ?`,
        args: [id, user_id],
    });

    // Return the number of rows affected. 
    // This will be 1 if the delete was successful, and 0 if no matching blog was found.
    return deletedBlog.rowsAffected;
}


export const getAllBlogs = async () => {
    const results = await db.execute({
        sql: `
            SELECT 
                b.id,
                b.title,
                b.slug,
                b.created_at,
                u.first_name,
                u.last_name
            FROM 
                blogs AS b
            LEFT JOIN 
                users AS u ON b.user_id = u.id
            ORDER BY 
                b.created_at DESC;
        `,
        args: []
    });

    return results.rows;
};

export const getBlogBySlug = async(slug) => {
    const result = await db.execute({
        sql: `
            SELECT 
                b.id, b.title, b.slug, b.content, b.created_at, b.updated_at,
                u.first_name, u.last_name
            FROM 
                blogs AS b
            LEFT JOIN 
                users AS u ON b.user_id = u.id
            WHERE 
                b.slug = ?;
        `,
        args: [slug]
    });

    return result.rows.length > 0 ? result.rows[0] : null;
}



export const getBlogById = async(blogId) => {
    const result = await db.execute({
        sql: `
            SELECT 
                b.id, b.title, b.slug, b.content, b.created_at, b.updated_at,
                u.first_name, u.last_name
            FROM 
                blogs AS b
            LEFT JOIN 
                users AS u ON b.user_id = u.id
            WHERE 
                b.id = ?;
        `,
        args: [blogId]
    });

    return result.rows.length > 0 ? result.rows[0] : null;
}
