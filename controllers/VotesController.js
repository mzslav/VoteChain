import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Poll from '../models/Poll.js';  
import connectToDatabase from '../db.js';
import cors from 'cors';
import VoteModel from '../models/Vote.js';
import Vote from '../models/Vote.js';
import { aggregatePolls } from '../services/aggregation.js'



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
            .select('title description options endTime isClosed contractAddress createdAt views') 
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
    try {
        const { title, description, options, endTime, contractAddress } = req.body;


        if (!title || !description || !options || !endTime || !contractAddress) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newVote = new Poll({
            title,
            description,
            options,
            endTime,
            contractAddress
        });

        await newVote.save();


        res.status(201).json({
            message: 'Vote created successfully',
            vote: newVote
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating vote', error: error.message });
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

