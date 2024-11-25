import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: false // i have to set required false because I want users to add these after sign up (but this will be required.)
  },
  languages: {
    type: Array,  // will be an array of dictionarys [{language: x, proficiency: y}]
    required: false
  },
  interests: {  // i will make it so users can enter nothing here.
    type: Array,
    required: false,
    default: []
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
