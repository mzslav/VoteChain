import express from 'express';
import jwt from 'jsonwebtoken'
import User from '../models/User.js';

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
            // Якщо користувача немає, створюємо новий із MetaMask-адресою
            const newUser = new User({ metamaskAdress });
            user = await newUser.save();

            message = 'New user registered successfully';
        } else {
            message = 'User logged in successfully';
        }

        // Генеруємо JWT токен для користувача
        const token = jwt.sign(
            { userID: user._id, metamaskAdress: user.metamaskAdress },
            process.env.JWT_CODE, 
            { expiresIn: '5h' } 
        );

        return res.json({
            success: true,
            message: message,
            ... user,
            token: token, 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Can't create or login user",
        });
    }
};
