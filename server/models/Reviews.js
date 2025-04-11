import mongoose from "mongoose";

const reviewsScema = new mongoose.Schema({
  level: { type: String, require: true, trim: true },
  project: { type: String, require: true, trim: true },
  name: { type: String, require: true, trim: true },
  img: { type: Array, default: [] },
  description: { type: String, require: true, trim: true },
});

const ReviewsModel = mongoose.model("reviews", reviewsScema);

export default ReviewsModel;
