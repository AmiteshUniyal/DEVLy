import express, { urlencoded } from 'express';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js'
import notifRoutes from './routes/notification.routes.js'
import connectMongoDB from './db/mongodb.js';
import userRoutes from './routes/user.routes.js'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';
import cors from "cors";

dotenv.config();
cloudinary.config({
    cloudName : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,     
    api_secret : process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 8080;
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended : true})); 
app.use(cookieParser());
app.use(
    cors({
      origin: process.env.F_URL,
      credentials: true,
    })
  );
  

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notifRoutes);


app.get("/", (req, res) => {
    res.send("hello Biatch"); 
});

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
})