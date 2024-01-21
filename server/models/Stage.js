import mongoose from "mongoose";

const stageScema = new mongoose.Schema({
  level: { type: String, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  icon: { type: String, require: true, trim: true },
  img: { type: Array, default: [] },
  description: { type: String, require: true, trim: true },
});

const StageModel = mongoose.model("stage", stageScema);

export default StageModel;
