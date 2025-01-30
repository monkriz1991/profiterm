import NewsModel from "~/server/models/News";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { kirilica: data };
    const result = await NewsModel.find(obj);
    return result[0];
  } catch (err) {
    console.log(err);
  }
});
