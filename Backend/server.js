import express, { urlencoded } from 'express';
import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/mongodb.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true})); 
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("hello Biatch"); 
});

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
})