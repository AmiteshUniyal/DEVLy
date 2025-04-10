import mongoose from "mongoose";

const connectMongoDB = async() => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${connect.connection.host}`);
    }
    catch(error){
        console.error(`Error Connection to mongodb: ${error.message}`);
        process.exit(1);
    }
}
export default connectMongoDB;