import ProjectModel from "~/server/models/Project";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    // Построение базового запроса
    let query = {};
    if (data.ParamsCat) {
      query.category = data.ParamsCat;
    }

    // Используем агрегирование для выборки нужных полей и сортировки
    const aggregationPipeline = [
      { $match: query },
      {
        $addFields: {
          specialSortField: {
            $cond: {
              if: { $or: [{ $eq: ["$level", null] }, { $eq: ["$level", 0] }] },
              then: 1,
              else: 0,
            },
          },
        },
      },
      { $sort: { specialSortField: 1, level: 1 } },
      { $skip: data.sortPage || 0 },

      // Выбираем только нужные поля
      {
        $project: {
          category: 1,
          img: 1,
          kirilica: 1,
          level: 1,
          title: 1,
        },
      },
    ];

    // Добавляем этап $limit только если задан pageSize
    if (data.pageSize) {
      aggregationPipeline.push({ $limit: data.pageSize });
    }

    const result = await ProjectModel.aggregate(aggregationPipeline);
    const count = await ProjectModel.countDocuments(query);

    return { result, count };
  } catch (err) {
    console.log(err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
      data: err.message,
    });
  }
});
