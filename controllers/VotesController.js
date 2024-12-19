import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Poll from '../models/Poll.js';  
import connectToDatabase from '../db.js';
import cors from 'cors';
import VoteModel from '../models/Vote.js';
import Vote from '../models/Vote.js';
import User from '../models/User.js';
import { aggregatePolls } from '../services/aggregation.js'
import { VoteValidation } from '../validations/voteValidation.js';
import { validationResult } from 'express-validator';



export const GetAllVotes = async (req, res) => {
    const { sort = 'createdAt', order = 'asc', isClosed, search } = req.query;

    try {
      
        const type = req.query.type || 'created'; // "active" або "created"
        const period = req.query.period || '7days'; // "7days", "1month", "6months", "1year"


        let filter = {};
           
        if (isClosed !== undefined) {
            filter.isClosed = isClosed === 'true'; 
        }
   
        if (search) {
            filter.title = { $regex: search, $options: 'i' }; 
        }
        
        let sortCriteria = {};
        if (sort === 'views') {
            sortCriteria = { views: order === 'desc' ? -1 : 1 }; 
        } else if (sort === 'isClosed') {
            sortCriteria = { isClosed: order === 'desc' ? -1 : 1 }; 
        } else {
            sortCriteria = { [sort]: order === 'desc' ? -1 : 1 }; 
        }

        const statistics = await aggregatePolls(type, period);
        
        const polls = await Poll.find(filter)
            .sort(sortCriteria) 
            .lean();

        if (!polls || polls.length === 0) {
            return res.status(404).json({ message: "No polls found" });
        }


        res.status(200).json({polls,statistics}); 
    } catch (error) {
        console.error("Error retrieving polls: ", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const GetVotesDetails = async (req, res) => {
    try {
        const pollId = req.params.id;
        
        const pollDetails = await Poll.findById(pollId)
            .select('title description options endTime isClosed contractAddress createdAt views imageUrl') // Додаємо imageUrl
            .lean();

        if (!pollDetails) {
            return res.status(404).json({ message: 'Vote not found' });
        }

        res.status(200).json({
            id: pollDetails._id,
            title: pollDetails.title,
            description: pollDetails.description,
            options: pollDetails.options,
            endTime: pollDetails.endTime,
            isClosed: pollDetails.isClosed,
            contractAddress: pollDetails.contractAddress,
            createdAt: pollDetails.createdAt,
            views: pollDetails.views,
            imageUrl: pollDetails.imageUrl,  // Додаємо imageUrl до відповіді
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const viewCount = async (req, res) => {
    try {
        const pollId = req.params.id;


        const poll_Count = await Poll.findById(pollId);

        if (!poll_Count) {
            return res.status(404).json({ message: 'Vote not found' });
        }

        poll_Count.views = (poll_Count.views || 0) + 1;


        await poll_Count.save();

        res.status(200).json({
            message: 'View count updated successfully',
            views: poll_Count.views,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const CreateVote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array(),
        });
    }

    try {
        const { title, description, options, endTime, contractAddress, imageUrl } = req.body;
        const metamaskAdress = req.metamaskAdress; // використовуємо "metamaskAdress"

        if (!metamaskAdress) {
            return res.status(403).json({
                success: false,
                message: 'MetaMask address not found in token',
            });
        }

        const existingVote = await Poll.findOne({ contractAddress });
        if (existingVote) {
            return res.status(400).json({
                success: false,
                message: 'A vote with this contract address already exists.',
            });
        }

        const voteData = {
            title,
            description,
            options,
            endTime,
            contractAddress,
            owner: metamaskAdress, // використовуємо "metamaskAdress"
            imageUrl,  // Додаємо картинку
        };

        // Створюємо новий запис голосування
        const newVote = new Poll(voteData);
        await newVote.save();

        // Оновлюємо профіль користувача
        const user = await User.findOne({ metamaskAdress }); // використовуємо "metamaskAdress"
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        user.pollIds.push(newVote._id);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Vote created successfully',
            vote: newVote,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to create vote',
            error: error.message,
        });
    }
};




export const Complain = async (req, res,next) => {
    try {
        const pollId = req.params.id;


        const poll_Count = await Poll.findById(pollId);

        if (!poll_Count) {
            return res.status(404).json({ message: 'Vote not found' });
        }

        poll_Count.complains = (poll_Count.complains || 0) + 1;


        await poll_Count.save();
        
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

