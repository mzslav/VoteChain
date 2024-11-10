import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const dbURI = process.env.DB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Succesful connect to MongoDB');
    } catch (error) {
        console.error('Connection error MongoDB:', error.message);
        process.exit(1); 
    }
};

export default connectDB; 
