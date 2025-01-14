import Vote from '../models/Vote.js';
import Poll from '../models/Poll.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
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
    try {
        const metamaskAddress = req.metamaskAdress; // Беремо MetaMask адресу з токена

        // Перевіряємо, чи є MetaMask-адреса
        if (!metamaskAddress) {
            return res.status(400).json({
                success: false,
                message: 'MetaMask address not found in token',
            });
        }

        // Знаходимо користувача за MetaMask-адресою
        const user = await User.findOne({ metamaskAdress: metamaskAddress });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const userID = user._id;  // Отримуємо userId з користувача

        const pollID = req.params.id;
        const chosenOptionID = req.params.id_vote;

        const poll = await Poll.findById(pollID);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Перевіряємо, чи голосування вже закрите
        if (poll.isClosed) {
            return res.status(400).json({ message: 'This poll is closed, you cannot vote.' });
        }

        // Перевіряємо, чи вже був голос від цього користувача
        const existingVote = await Vote.findOne({ userID, pollId: pollID });
        if (existingVote) {
            return res.status(400).json({ message: 'You have already voted in this poll' });
        }

        const chosenOption = poll.options.find(opt => opt.optionId.toString() === chosenOptionID);

        if (!chosenOption) {
            return res.status(400).json({ message: 'Invalid option' });
        }

        // Створюємо новий голос, додаючи MetaMask-адресу
        const vote = new Vote({
            userID,
            pollId: pollID,
            chosenOption: chosenOption.optionId,
            chosenOptionText: chosenOption.optionText,
            metamaskAdress: req.metamaskAdress,  // Використовуємо MetaMask-адресу з мідлвару
        });

        await vote.save();

        // Оновлюємо кількість голосів для цієї опції
        chosenOption.voteCount += 1;
        await poll.save();

        res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
