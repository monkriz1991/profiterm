import mongoose from "mongoose";

const maintwoScema = new mongoose.Schema({
  type: { type: String, require: true, trim: true },
  level: { type: String, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  img: { type: Array, default: [] },
});

const MainTwoModel = mongoose.model("maintwo", maintwoScema);

export default MainTwoModel;
