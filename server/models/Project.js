import mongoose from "mongoose";

const projectScema = new mongoose.Schema({
  level: { type: Number, require: true, trim: true },
  category: { type: String, require: true, trim: true },
  title: { type: String, require: true, trim: true },
  kirilica: { type: String, require: true, trim: true },
  preview: { type: String, require: true, trim: true },
  seo_title: { type: String, require: true, trim: true },
  seo_description: { type: String, require: true, trim: true },
  img: { type: Array, default: [] },
  galery: { type: Array, default: [] },
  video: { type: String, require: true, trim: true },
  info: { type: String, require: true, trim: true },
  // show_index: { type: String, require: true, trim: true },
  description: { type: String, require: true, trim: true },
  // filter: { type: Array, default: [] },
});

const ProjectModel = mongoose.model("project", projectScema);

export default ProjectModel;
