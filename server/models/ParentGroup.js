import mongoose from "mongoose";

const parentgroupScema = new mongoose.Schema({
  level: { type: Number, require: true, trim: true },
  typecalk: { type: String, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  icon: { type: String, require: true, trim: true },
  description: { type: String, require: true, trim: true },
});

const ParentGroupModel = mongoose.model("parentgroup", parentgroupScema);

export default ParentGroupModel;
