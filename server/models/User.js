import mongoose from "mongoose";

const UserScema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: { type: String, require: true, length: [8, "Password is long"] },
  status: {
    type: String,
    require: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
});

const User = mongoose.model("User", UserScema);

export default User;
