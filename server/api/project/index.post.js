import ProjectModel from "~/server/models/Project";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    // Построение базового запроса
    let query = {};
    if (data.ParamsCat) {
      query.category = data.ParamsCat;
    }

    // Используем агрегирование для сортировки
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
