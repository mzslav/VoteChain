import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Poll from '../models/Poll.js';  
import connectToDatabase from '../db.js';
import cors from 'cors';
import VoteModel from '../models/Vote.js';
import Vote from '../models/Vote.js';

export const GetActiveVotes = async (req, res) => {};



export const GetVotesDetails = async (req, res) => {
    try {
        const pollId = req.params.id;
        
        const pollDetails = await Poll.findById(pollId)
            .select('title description options endTime isClosed contractAddress createdAt') 
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
