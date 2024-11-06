import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
    title: { type: String, required: true },
    options: [
        {
            option: { type: String, required: true },
            votes: { type: Number, default: 0 }
        }
    ]
});

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
