import { ensureConnection } from "~/server/utils/mongoose";
import ProjectModel from "~/server/models/Project";

export default defineEventHandler(async (event) => {
  try {
    await ensureConnection();
    const data = (await readBody(event)) || {};
    const query = {};

    if (data.ParamsCat) {
      query.category = data.ParamsCat;
    }
    // Aggregation with field projection for index page
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

    if (data.pageSize) {
      aggregationPipeline.push({ $limit: data.pageSize });
    }

    const [result, count] = await Promise.all([
      ProjectModel.aggregate(aggregationPipeline),
      ProjectModel.countDocuments(query),
    ]);

    return { result, count };
  } catch (err) {
    console.error("[API] Project index error:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch projects",
    });
  }
});
