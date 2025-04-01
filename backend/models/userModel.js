import db from "../config/db.js"

export const createUser = async (user) => {
    await db.execute({
        sql : `INSERT INTO users (first_name, last_name, username, dob, email, password) values (?, ?, ?, ?, ?, ?)`,
        args : [user.first_name, user.last_name, user.username, user.dob, user.email, user.password],
    })
}

export const findUserByEmail = async (email) => {
    const result = await db.execute({
        sql : `SELECT * FROM users WHERE email=?`,
        args : [email],
    })

    return result.rows[0];
}

export const findUserByUsername = async (username) => {
    const result = await db.execute({
        sql : `SELECT * FROM users WHERE username=?`,
        args : [username],
    })

    return result.rows[0];
}

