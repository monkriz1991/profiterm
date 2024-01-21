import mongoose from "mongoose";

const reviewsScema = new mongoose.Schema({
  project: { type: String, require: true, trim: true },
  name: { type: String, require: true, trim: true },
  img: { type: Array, default: [] },
  description: { type: String, require: true, trim: true },
});

const ReviewsModel = mongoose.model("reviews", reviewsScema);

export default ReviewsModel;
