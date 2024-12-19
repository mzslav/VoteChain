import mongoose from "mongoose";
import User from "./User.js"; 
import Poll from "./Poll.js"; 

const voteSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    immutable: true,
  },
  pollId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Poll',
    required: true,
    immutable: true,
  },
  chosenOption: {
    type: mongoose.Schema.Types.ObjectId,  // Просто ID вибраної опції
    required: true,
  },
  chosenOptionText: {  // Текст вибраної опції для відображення
    type: String,
    required: true,
  },
  metamaskAdress: { // Нове поле для зберігання MetaMask-адреси користувача
    type: String,
    required: true,
  },
});

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
