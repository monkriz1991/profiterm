import NewsModel from "~/server/models/News";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    const filter = {};
    if (data != undefined && !data.Project) {
      if (data.levelFilter) {
        filter.level_index = { $in: [1, 2, 3] };
      }
      const result = await NewsModel.find(filter)
        .sort({ level: 1 })
        .skip(data.sortPage)
        .limit(data.pageSize);
      const count = await NewsModel.find(filter).count();
      return { result, count };
    } else {
      const result = await NewsModel.find().sort({ level: 1 });
      return result;
    }
  } catch (err) {
    console.log(err);
  }
});
