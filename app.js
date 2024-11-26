import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Poll from './models/Poll.js';  
import connectToDatabase from './db.js';
import * as UserController from './controllers/UserController.js'
import cors from 'cors';


import * as voteProccesor from './services/voteProcessor.js'
import * as VotesController from './controllers/VotesController.js'
import checkToken from './utils/checkToken.js';
import handleComplains from './utils/delete_vote_by_complains.js';

const __dirname = path.resolve();
const app = express();
app.use(cors());
app.use(express.json());


async function startServer() {
    try {
        await app.listen(process.env.HTTP_PORT, () => {
            console.log(`Server running on port ${process.env.HTTP_PORT}`);
        });
        await connectToDatabase();
    } catch (error) {
        console.log(`Cant open server on ${process.env.HTTP_PORT} | Time: ${Date.now()} | Error message: ${error}`);
    }
    try {
        await app.listen(process.env.HTTPS_PORT, () => {
            console.log(`Server running on port ${process.env.HTTPS_PORT}`);
        });   
        await connectToDatabase();
    } catch (error) {
        console.log(`Cant open server on ${process.env.HTTPS_PORT} | Time: ${Date.now()} | Error message: ${error}`);
    }
}


app.post('/login',UserController.connectUser)

app.get('/votes/all',VotesController.GetAllVotes);

app.get('/votes/:id/details',VotesController.GetVotesDetails);
app.post('/votes/:id/details', VotesController.viewCount);

app.get('/votes/:id/vote',voteProccesor.getAllOptions);
app.post('/votes/:id/vote/:id_vote',voteProccesor.toVoteByOption);


app.post('/votes/:id/complain',  VotesController.Complain, handleComplains);


app.post('/votes/create', VotesController.CreateVote);


startServer();
