import mongoose from "mongoose";

const itemcalkScema = new mongoose.Schema({
  level: { type: Number, require: true, trim: true },
  typecalk: { type: String, require: true, trim: true },
  name: { type: String, require: true, trim: true },
  unit: { type: Number, require: true, trim: true },
  type: { type: String, require: true, trim: true },
  cost: { type: Number, require: true, trim: true },
  unitcoefficient: { type: Number, require: true, trim: true },
  coefficient: { type: Number, require: true, trim: true },
});

const ItemCalkModel = mongoose.model("itemcalk", itemcalkScema);

export default ItemCalkModel;
