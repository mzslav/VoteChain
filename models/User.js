import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  userID: {
    type: Number,
    unique: true,
    required: true,
    index: true,
    immutable: true,
      },
  metamaskAdress: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  DIDhash: {
    type: String,
    required: true,
    immutable: true,
  },
  DIDverified: {
    type: Boolean,
    required: true,
    default: false,
},
  registrationDate: {
    type: Date,
    default: Date.now,
    required: true,
  }
});

const User = mongoose.model('User', userSchema);


export default User;


