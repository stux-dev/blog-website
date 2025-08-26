import 'dotenv/config'
import express from "express"
import cors from "cors"
import authRoute from "./routes/authRoute.js"
import blogRoute from "./routes/blogRoute.js"
import errorHandler from './middlewares/errorHandler.js'

const PORT = process.env.PORT || 3000
const app = express();
app.use(express.json());
app.use(cors({
    origin : process.env.FRONTEND_URL || 'http://localhost:5173',
    optionsSuccessStatus : 200
}));


app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);


app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Route Not Found' });
});


app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));