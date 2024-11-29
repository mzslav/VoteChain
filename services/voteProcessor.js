import Vote from '../models/Vote.js';
import Poll from '../models/Poll.js';
import mongoose from 'mongoose';

export const getAllOptions = async (req, res) => {
    const pollId = req.params.id;
    const poll = await Poll.findById(pollId);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    res.status(200).json({
      title: poll.title,
      options: poll.options,
      pollId: poll._id
    });
};


export const toVoteByOption = async (req, res) => {
    const userID = req.body.userId || req.params.userId;  // Отримуємо userId з тіла запиту або з параметрів URL
    if (!userID) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const pollID = req.params.id;
    const chosenOptionID = req.params.id_vote;
    
 
    const poll = await Poll.findById(pollID);
    
    if (!poll) {
        return res.status(404).json({ message: 'Poll not found' });
    }

  
    if (poll.isClosed) {
        return res.status(400).json({ message: 'This poll is closed, you cannot vote.' });
    }

   
    const existingVote = await Vote.findOne({ userID, pollId: pollID });
    if (existingVote) {
        return res.status(400).json({ message: 'You have already voted in this poll' });
    }

    const chosenOption = poll.options.find(opt => opt.optionId.toString() === chosenOptionID);
    
    if (!chosenOption) {
        return res.status(400).json({ message: 'Invalid option' });
    }
    
    const vote = new Vote({
        userID,
        pollId: pollID,
        chosenOption: chosenOption.optionId,
        chosenOptionText: chosenOption.optionText,
    });
    
    await vote.save();
    
    // Оновлюємо кількість голосів для цієї опції
    chosenOption.voteCount += 1;
    await poll.save();
    
    res.status(200).json({ message: 'Vote recorded successfully' });
};

