import ReviewsModel from "~/server/models/Reviews";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const reviews = await ReviewsModel.create(data);
    return reviews;
  } catch (err) {
    console.log(err);
  }
});
