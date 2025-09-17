import 'dotenv/config'
import express from "express"
import cors from "cors"
import authRoute from "./routes/authRoute.js"
import blogRoute from "./routes/blogRoute.js"
import errorHandler from './middlewares/errorHandler.js'

const PORT = process.env.PORT || 3000
const app = express();
app.use(express.json());

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];

app.use(cors({
    origin: function (origin, callback) {
       
        if (!origin) return callback(null, true);

        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    optionsSuccessStatus: 200,
    credentials: true 
}));

app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);


app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'Route Not Found' });
});


app.use(errorHandler);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
