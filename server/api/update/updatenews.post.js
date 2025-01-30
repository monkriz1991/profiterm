import { ref } from "vue";
import NewsModel from "~/server/models/News";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const news = await NewsModel.replaceOne(obj, data);
    return news;
  } catch (err) {
    console.log(err);
  }
});
