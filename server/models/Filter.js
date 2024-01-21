import mongoose from "mongoose";

const filterScema = new mongoose.Schema({
  id_category: { type: String, require: true, trim: true },
  name: { type: String, require: true, trim: true },
  kirilica: { type: String, require: true, trim: true },
  type: { type: String, require: true, trim: true },
});

const FilterModel = mongoose.model("filter", filterScema);

export default FilterModel;
