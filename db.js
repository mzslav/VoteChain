import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();


async function connectToDatabase(uri) {
    try{
        const uri = process.env.DB_CONECTION_STRING;
        await mongoose.connect(uri);
        console.log("Database is connected");
    }
    catch{
        console.error("Database connection failed: ", error);
            process.exit(1);
    }    
}

export default connectToDatabase; 
