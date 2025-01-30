import NewsModel from "~/server/models/News";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    if (data != undefined && !data.Project) {
      const result = await NewsModel.find()
        .sort({ level: 1 })
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await NewsModel.find().count();
      return { result, count };
    } else {
      const result = await NewsModel.find().sort({ level: 1 });
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
