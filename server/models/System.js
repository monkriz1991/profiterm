import mongoose from "mongoose";

const sistemScema = new mongoose.Schema({
  level: { type: String, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  icon: { type: String, require: true, trim: true },
  info: { type: String, require: true, trim: true },
  img: { type: Array, default: [] },
  video: { type: Array, default: [] },
  description: { type: String, require: true, trim: true },
});

const SistemModel = mongoose.model("sistem", sistemScema);

export default SistemModel;
