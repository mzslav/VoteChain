import { body } from 'express-validator';

export const VoteValidation = [
    body('title', 'Title must be between 3 and 255 characters.')
        .isLength({ min: 3, max: 255 })
        .trim(),

    body('description', 'Description must be between 10 and 1000 characters.')
        .isLength({ min: 10, max: 1000 })
        .trim(),

    body('options')
        .isArray({ min: 2 })
        .withMessage('Options must be an array with at least 2 elements.')
        .custom((options) => {
            if (!options.every(option => typeof option === 'object' && typeof option.optionText === 'string' && option.optionText.trim().length > 0)) {
                throw new Error('Each option must be an object with a non-empty "optionText" field.');
            }
            return true;
        }),

    body('endTime', 'End time must be a future date.')
        .isISO8601()
        .toDate()
        .custom((value) => {
            if (value <= new Date()) {
                throw new Error('End time must be in the future.');
            }
            return true;
        }),
];
