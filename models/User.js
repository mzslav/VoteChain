import mongoose from 'mongoose';
import Poll from './Poll.js';

const userSchema = new mongoose.Schema({
  metamaskAdress: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  DIDhash: {
    type: String,
    immutable: true,
  },
  DIDverified: {
    type: Boolean,
    default: false,
},
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  pollIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Poll', 
    },
  ],
  
},
{
  timestamps: true,
},
);

const User = mongoose.model('User', userSchema);


export default User;


