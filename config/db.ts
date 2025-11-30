import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.set('bufferCommands', false);

const DATABASE_URL:string = process.env.DATABASE_URL || "";
const connectDB = async(): Promise<void> =>{
    try{
        await mongoose.connect(DATABASE_URL);
        console.log("Database Connected!");
    }catch(err){
        console.log(`Failed to connect to Database, error: ${err}`);
        process.exit(1);
    }
}

export {connectDB};