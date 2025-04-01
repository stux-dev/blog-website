import jwt from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (user) => {
    return jwt.sign({
        id : user.id,
        email : user.email
    }, JWT_SECRET,{ expiresIn : "30d"})
}

