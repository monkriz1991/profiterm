import NewsModel from "~/server/models/News";

export default defineEventHandler(async (event) => {
  try {
    const data = (await readBody(event)) || {};

    const filter = {};
    if (!data.Project) {
      if (data.levelFilter) {
        filter.level_index = { $in: [1, 2, 3] };
      }

      let query = NewsModel.find(filter).sort({ level: 1 });

      if (data.selectFields) {
        query = query.select(
          "level level_index title title_index subtitle kirilica img"
        );
      }

      if (data.sortPage !== undefined && data.pageSize !== undefined) {
        query = query.skip(data.sortPage).limit(data.pageSize);
      }

      const result = await query;
      const count = await NewsModel.countDocuments(filter);
      return { result, count };
    } else {
      const result = await NewsModel.find().sort({ level: 1 });
      return result;
    }
  } catch (err) {
    console.error("Ошибка в API /news:", err);
    return { error: "Произошла ошибка при загрузке данных" };
  }
});
