import express, { urlencoded } from 'express';
import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/mongodb.js';
import userRoutes from './routes/user.routes.js'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();
cloudinary.config({
    cloudName : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,     
    api_secret : process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true})); 
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
    res.send("hello Biatch"); 
});

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
})