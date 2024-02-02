import fs from "fs";
import Reviews from "~/server/models/Reviews";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const reviews = await Reviews.deleteOne(obj);
    return reviews;
  } catch (err) {
    console.log(err);
  }
});
