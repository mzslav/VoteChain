import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Poll from './models/Poll.js';  
import connectDB from './db.js'; 

connectDB();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 3500;




app.use(express.json());
app.use(express.json());  
app.use(express.static(path.resolve(__dirname, 'static')));  


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

