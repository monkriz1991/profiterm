import mongoose from "mongoose";

const typecalkScema = new mongoose.Schema({
  level: { type: Number, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  description: { type: String, require: true, trim: true },
  icon: { type: String, require: true, trim: true },
  img: { type: String, require: true, trim: true },
  show_check: { type: Boolean, default: false },
});

const TypeCalkModel = mongoose.model("typecalk", typecalkScema);

export default TypeCalkModel;
