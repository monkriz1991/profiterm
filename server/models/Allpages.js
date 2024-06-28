import mongoose from "mongoose";

const allpagesScema = new mongoose.Schema({
  img: { type: Array, default: [] },
  installment: { type: String, require: true, trim: true },
  about: { type: String, require: true, trim: true },
  contacts: { type: String, require: true, trim: true },
  email: { type: String, require: true, trim: true },
  phone: { type: String, require: true, trim: true },
  dopphone: { type: String, require: true, trim: true },
});

const AllPagesModel = mongoose.model("allpages", allpagesScema);

export default AllPagesModel;
