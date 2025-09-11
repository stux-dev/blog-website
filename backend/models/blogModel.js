import db from "../config/db.js";

export const createBlog = async (userId, blogData) => {
    const status = blogData.status || "draft";
    const insertedBlog = await db.execute({
        sql: `INSERT INTO blogs (user_id, title, slug, content, status) 
            VALUES (?, ?, ?, ?, ?) 
            RETURNING id, slug`,
        args: [userId, blogData.title, blogData.slug, blogData.content, status],
    });

    return insertedBlog.rows[0];
};
export const updateBlog = async (userId, blogId, blogData) => {
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
        .map(
            (key) =>
                `${key} = ${key === "updated_at" ? fieldsToUpdate[key] : "?"}`
        )
        .join(", ");

    const args = Object.entries(fieldsToUpdate)
        .filter(([key]) => key !== "updated_at")
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
};

export const deleteBlogById = async (id, user_id) => {
    if (!id || !user_id) {
        throw new Error(
            "Both blog ID and user ID must be provided to delete a post."
        );
    }

    const deletedBlog = await db.execute({
        sql: `DELETE FROM blogs WHERE id = ? AND user_id = ?`,
        args: [id, user_id],
    });

    // Return the number of rows affected.
    // This will be 1 if the delete was successful, and 0 if no matching blog was found.
    return deletedBlog.rowsAffected;
};

export const getAllBlogs = async () => {
    const results = await db.execute({
        sql: `
            SELECT 
                b.id,
                b.title,
                b.slug,
                b.created_at,
                b.view_count,
                u.first_name,
                u.last_name
            FROM 
                blogs AS b
            LEFT JOIN 
                users AS u ON b.user_id = u.id
            ORDER BY 
                b.created_at DESC;
        `,
        args: [],
    });

    return results.rows;
};

export const getAllBlogsForUser = async (userId) => {
    const results = await db.execute({
        sql: `
            SELECT 
                b.id,
                b.title,
                b.slug,
                b.created_at,
                b.view_count,
                u.first_name,
                u.last_name
            FROM 
                blogs AS b
            LEFT JOIN 
                users AS u ON b.user_id = u.id
            WHERE 
                b.user_id = ? 
            ORDER BY 
                b.created_at DESC;
        `,
        // Pass the userId into the args array for secure filtering
        args: [userId], 
    });

    return results.rows;
};

export const getBlogBySlug = async (slug) => {
    const result = await db.execute({
        sql: `
            SELECT 
                b.id,b.user_id, b.title, b.slug, b.content, b.created_at, b.updated_at, b.view_count,
                u.first_name, u.last_name
            FROM 
                blogs AS b
            LEFT JOIN 
                users AS u ON b.user_id = u.id
            WHERE 
                b.slug = ?;
        `,
        args: [slug],
    });

    if (result.rows.length === 0) {
        return null;
    }

    const blog = result.rows[0];

    const logViewPromise = db.execute({
        sql: `
            INSERT INTO blog_views (blog_id, user_id)
            VALUES (?, ?);
        `,
        args: [blog.id, blog.user_id], // Use the blog id and the author's user id
    });

    const updateCountPromise = db.execute({
        sql: `
            UPDATE blogs
            SET view_count = view_count + 1
            WHERE id = ?;
        `,
        args: [blog.id],
    });

    Promise.all([logViewPromise, updateCountPromise]).catch((err) => {
        // This will catch an error from either the INSERT or UPDATE operation.
        console.error("Failed to update view analytics:", err);
    });

    return blog;
};

export const getBlogById = async (blogId) => {
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
        args: [blogId],
    });

    return result.rows.length > 0 ? result.rows[0] : null;
};

export const getDailyViewsForUser = async (userId) => {
    const result = await db.execute({
        sql: `
        SELECT
            strftime('%Y-%m-%d', viewed_at, 'unixepoch') AS view_date,
            CAST(COUNT(id) AS INTEGER) AS daily_views
        FROM
            blog_views
        WHERE
            user_id = ?
            AND viewed_at >= strftime('%s', 'now', '-7 days')
        GROUP BY
            view_date
        ORDER BY
            view_date ASC;
    `,
        args: [userId],
    });

    return result.rows;
};

export const getUserInfo = async (userId) => {
    const result = await db.execute({
        sql: `
            SELECT
                u.id,
                u.first_name,
                u.last_name,
                u.email,
                u.dob,
                u.created_at AS user_creation_date,
                COUNT(b.id) AS total_blogs,
                COALESCE(SUM(b.view_count), 0) AS total_views,
                ROUND(COALESCE(AVG(b.view_count), 0), 2) AS average_views
            FROM
                users u
            LEFT JOIN
                blogs b ON u.id = b.user_id
            WHERE 
            user_id = ?
            GROUP BY
                u.id`,

        args: [userId],
    });

    return result.rows;
};


