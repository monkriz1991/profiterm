import Reviews from "~/server/models/Reviews";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const reviews = await Reviews.deleteOne(data);
    return reviews;
  } catch (err) {
    console.log(err);
  }
});
