import mongoose from "mongoose";

const mainoneScema = new mongoose.Schema({
  type: { type: String, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  img: { type: Array, default: [] },
  video: { type: Array, default: [] },
  video_mobail: { type: Array, default: [] },
  preview: { type: String, require: true, trim: true },
  description: { type: String, require: true, trim: true },
});

const MainOneModel = mongoose.model("mainone", mainoneScema);

export default MainOneModel;
