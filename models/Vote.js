import mongoose, { mongo } from "mongoose";
import User from "./User";
import Poll from "./Poll";

const voteSchema = new mongoose.Schema({
 voteID: {
    type: Number,
    unique: true,
    required: true,
    index: true,
    immutable: true
 },
 userID: {
    type: mongoose.Schema.ObjectId.userID,
    ref: User,
    required: true,
    immutable: true,
 },
 pollId:{
    type: mongoose.Schema.ObjectId.pollId,
    ref: Poll,
    required: true,
    immutable: true,
 },
 chosenOption: {
    type: [String],
    required: true,
    validate: 
        function(option) {
            return option.length > 0;
        },
        message: "You must choose at least one option",
    }
});

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;