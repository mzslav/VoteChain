import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Poll from './models/Poll.js';  

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());  
app.use(express.static(path.resolve(__dirname, 'static')));  


// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/votechain', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB succesfull');
}).catch(err => {
    console.log('MongoDB connection error:', err);
});
