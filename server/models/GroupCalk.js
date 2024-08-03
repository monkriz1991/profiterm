import mongoose from "mongoose";

const groupcalkScema = new mongoose.Schema({
  typecalk: { type: String, require: true, trim: true },
  level: { type: Number, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  group: { type: String, require: true, trim: true },
  description: { type: String, require: true, trim: true },
  show_check: { type: Boolean, default: false },
});

const GroupCalkModel = mongoose.model("groupcalk", groupcalkScema);

export default GroupCalkModel;
