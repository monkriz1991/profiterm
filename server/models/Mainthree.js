import mongoose from "mongoose";

const mainthreeScema = new mongoose.Schema({
  type: { type: String, require: true, trim: true },
  level: { type: String, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  yootube: { type: String, require: true, trim: true },
  img: { type: Array, default: [] },
  description: { type: String, require: true, trim: true },
});

const MainThreeModel = mongoose.model("mainthree", mainthreeScema);

export default MainThreeModel;
