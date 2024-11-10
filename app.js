import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Poll from './models/Poll.js';  
import connectDB from './db.js'; 

connectDB();

const __dirname = path.resolve();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors());








app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

