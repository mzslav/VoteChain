import mongoose from "mongoose";
import User from "./User.js"; 
import Poll from "./Poll.js"; 
const voteSchema = new mongoose.Schema({
  voteID: {
    type: Number,
    unique: true,
    required: true,
    index: true,
    immutable: true
  },
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
    type: [String],
    required: true,
    validate: {
      validator: function(option) {
        return option.length > 0;
      },
      message: "You must choose at least one option",
    }
  }
});

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
