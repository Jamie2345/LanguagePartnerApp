import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
  }
});

const RefreshTokenDB = mongoose.model("RefreshToken", RefreshTokenSchema);
export default RefreshTokenDB;