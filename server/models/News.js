import mongoose from "mongoose";

const newsScema = new mongoose.Schema({
  level: { type: Number, require: true, trim: true },
  level_index: { type: Number, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  title_index: { type: String, require: true, trim: true },
  seo_title: { type: String, require: true, trim: true },
  seo_description: { type: String, require: true, trim: true },
  subtitle: { type: String, require: true, trim: true },
  kirilica: { type: String, require: true, trim: true },
  video: { type: String, require: true, trim: true },
  icon: { type: String, require: true, trim: true },
  img: { type: Array, default: [] },
  galery: { type: Array, default: [] },
  description: { type: String, require: true, trim: true },
});

const NewsModel = mongoose.model("news", newsScema);

export default NewsModel;
