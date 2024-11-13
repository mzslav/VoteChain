import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 80,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 300,
  },
  options: [{
    optionText: {
      type: String,
      required: true,
      maxlength: 100,
    },
    voteCount: {
      type: Number,
      default: 0,
      required: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
    required: true,
  },
  isClosed: {
    type: Boolean,
    default: false,
    required: true,
  },
  contractAddress: {
    type: String,
    required: true,
    unique: true,
  },
});

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
