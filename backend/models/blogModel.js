import db from "../config/db.js";  

export const createBlog = async(blogData) => {

    const status = blogData.status || 'draft';
    const insertedBlog = await db.execute({
        sql:`INSERT INTO blogs (user_id, title, slug, content, status) 
            VALUES (?, ?, ?, ?, ?) 
            RETURNING id`,
        args:[
            blogData.user_id, 
            blogData.title, 
            blogData.slug, 
            blogData.content, 
            status
        ],
    });

    return insertedBlog.rows[0].id;
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
