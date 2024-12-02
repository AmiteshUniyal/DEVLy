import express from 'express';
import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/mongodb.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 8080;
const app = express();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("hello Biatch"); 
});

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    connectMongoDB();
})