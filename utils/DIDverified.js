import User from '../models/User.js';

export const checkDIDVerified = async (req, res, next) => {
    try {
        // `req.metamaskAdress` вже зберігається в JWT middleware
        const user = await User.findOne({ metamaskAdress: req.metamaskAdress });

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        if (!user.DIDverified) {
            return res.status(403).json({
                message: 'User verification required',
            });
        }

        next(); // Продовжуємо до наступного middleware або контролера
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error during verification',
        });
    }
};
