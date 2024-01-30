import mongoose from "mongoose";

const filesScema = new mongoose.Schema({
  id_files: { type: String, require: true, trim: true },
  id_object: { type: String, require: true, trim: true },
  type: { type: String, require: true, trim: true },
  files: { type: String, require: true, trim: true },
});

const FilesScema = mongoose.model("files", filesScema);

export default FilesScema;
