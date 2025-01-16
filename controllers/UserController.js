import express from 'express';
import jwt from 'jsonwebtoken'
import User from '../models/User.js';
import crypto from 'crypto';
import Vote from '../models/Vote.js';
import Poll from '../models/Poll.js';

export const connectUser = async (req, res) => {
    try {
        const { metamaskAdress } = req.body;

        if (!metamaskAdress) {
            return res.status(400).json({
                success: false,
                message: 'MetaMask address is required',
            });
        }

        let user = await User.findOne({ metamaskAdress });
        let message;

        if (!user) {
            // Створюємо нового користувача
            const newUser = new User({ metamaskAdress });
            user = await newUser.save();
            message = 'New user registered successfully';
        } else {
            message = 'User logged in successfully';
        }

        // Генеруємо JWT токен
        const token = jwt.sign(
            { userID: user._id, metamaskAdress: user.metamaskAdress },
            process.env.JWT_CODE,
            { expiresIn: '5h' }
        );

        return res.json({
            success: true,
            message,
            user: { ...user._doc },
            token,
        });
    } catch (error) {
        console.error("Error in connectUser:", error);
        res.status(500).json({
            success: false,
            message: "Can't create or login user",
        });
    }
};


export const getConfirm = async (req, res) => {
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

        // Перевіряємо, чи користувач вже має підтвердження
        if (user.DIDverified) {
            return res.json({
                success: false,
                message: 'User DID is already verified',
                DIDhash: user.DIDhash, // Можна повернути існуючий хеш, якщо потрібно
            });
        }

        // Генеруємо новий фейковий DID-хеш
        const fakeHash = crypto.randomBytes(16).toString('hex');

        // Оновлюємо статус верифікації та хеш
        user.DIDhash = fakeHash;
        user.DIDverified = true;
        await user.save();

        return res.json({
            success: true,
            message: 'User DID verified successfully',
            DIDhash: user.DIDhash,
            DIDverified: user.DIDverified,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Can't verify user DID",
        });
    }
};

export const getAllMyVotes = async (req, res) => {
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

        // Знаходимо всі голоси користувача
        const userVotes = await Vote.find({ metamaskAdress: metamaskAddress })
            .populate('pollId');  // Тепер лише популяція по pollId

        // Перевіряємо, чи є голоси
        if (userVotes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No votes found for this user',
            });
        }

        // Формуємо відповідь з інформацією про голосування та опції
        const votesData = userVotes.map(vote => {
            // Знаходимо вибрану опцію за її ID в масиві pollId.options
            const chosenOption = vote.pollId.options.find(opt => opt.optionId.toString() === vote.chosenOption.toString());

            return {
                pollId: vote.pollId._id,  // Додаємо ID голосування
                pollTitle: vote.pollId.title,
                pollDescription: vote.pollId.description,
                chosenOptionText: chosenOption.optionText,
                chosenOptionId: chosenOption.optionId,
                endTime: vote.pollId.endTime,
                voteTime: vote.createdAt,
                pollImageUrl: vote.pollId.imageUrl,  // Додаємо картинку
                createdAt: vote.pollId.createdAt,
                
            };
        });

        // Відправляємо відповідь
        return res.status(200).json({
            success: true,
            message: 'Votes found successfully',
            data: votesData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

export const getAllMyPolls = async (req, res) => {
    try {
        const metamaskAddress = req.metamaskAdress; // Беремо MetaMask адресу з токена

        // Перевіряємо, чи є MetaMask-адреса
        if (!metamaskAddress) {
            return res.status(400).json({
                success: false,
                message: 'MetaMask address not found in token',
            });
        }

        // Знаходимо всі голосування, де користувач є власником
        const myPolls = await Poll.find({ owner: metamaskAddress });

        // Перевіряємо, чи є голосування
        if (myPolls.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No polls found for this user',
            });
        }

        // Формуємо відповідь з інформацією про кожне голосування
        const pollsData = myPolls.map(poll => ({
            pollId: poll._id,  // Додаємо ID голосування
            pollTitle: poll.title,
            pollDescription: poll.description,
            pollEndTime: poll.endTime,
            pollIsClosed: poll.isClosed,
            pollContractAddress: poll.contractAddress,
            pollViews: poll.views,
            pollComplains: poll.complains,
            pollWinner: poll.winner,
            pollImageUrl: poll.imageUrl,  // Додаємо картинку
            createdAt: poll.createdAt,
        }));

        // Відправляємо відповідь
        return res.status(200).json({
            success: true,
            message: 'Polls found successfully',
            data: pollsData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

export const getUser = async (req, res) => {
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

        // Повертаємо тільки статус DIDverified
        return res.json({
            success: true,
            DIDverified: user.DIDverified,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Can't verify user DID",
        });
    }
};

export const getUserVoteDetails = async (req, res) => {
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
        const pollID = req.params.id; // ID голосування з параметрів запиту

        // Шукаємо існуючий голос цього користувача для зазначеного голосування
        const existingVote = await Vote.findOne({ userID, pollId: pollID });
        if (!existingVote) {
            return res.status(404).json({
                success: false,
                message: 'You have not voted in this poll',
            });
        }

        // Отримуємо варіант голосування, за який було віддано голос
        const poll = await Poll.findById(pollID);
        if (!poll) {
            return res.status(404).json({
                success: false,
                message: 'Poll not found',
            });
        }

        const chosenOption = poll.options.find(opt => opt.optionId.toString() === existingVote.chosenOption.toString());
        if (!chosenOption) {
            return res.status(404).json({
                success: false,
                message: 'Option not found',
            });
        }

        // Повертаємо відповідь із деталями голосування та transactionAddress
        res.status(200).json({
            success: true,
            message: 'Vote details retrieved successfully',
            vote: {
                _id: chosenOption._id,
                optionId: chosenOption.optionId,
                optionTitle: chosenOption.optionText, // Заголовок варіанту
                optionDescription: chosenOption.optionDescription || 'No description available', // Опис варіанту (якщо є)
                transactionAddress: existingVote.transactionAddress, // Додаємо транзакційну адресу
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

