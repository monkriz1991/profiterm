import NewsModel from "~/server/models/News";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const news = await NewsModel.create(data);
    return news;
  } catch (err) {
    console.log(err);
  }
});
