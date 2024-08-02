import mongoose from "mongoose";

const elementcalkScema = new mongoose.Schema({
  level: { type: Number, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  cost: { type: Number, require: true, trim: true },
});

const ElementCalkModel = mongoose.model("elementcalk", elementcalkScema);

export default ElementCalkModel;
