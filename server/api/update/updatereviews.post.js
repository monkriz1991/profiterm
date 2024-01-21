import { ref } from "vue";
import ReviewsModel from "~/server/models/Reviews";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const reviews = await ReviewsModel.replaceOne(obj, data);
    return reviews;
  } catch (err) {
    console.log(err);
  }
});
