import { ensureConnection } from "~/server/utils/mongoose";
import ProjectModel from "~/server/models/Project";

export default defineEventHandler(async (event) => {
  try {
    const data = (await readBody(event)) || {};
    const query = {};

    if (data.ParamsCat && typeof data.ParamsCat === "string") {
      query.category = data.ParamsCat;
    }

    const skip = Number(data.sortPage) || 0;
    const limit = Number(data.pageSize) || 0;

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
      { $skip: skip },
    ];

    if (limit) aggregationPipeline.push({ $limit: limit });

    const [result, count] = await Promise.all([
      ProjectModel.aggregate(aggregationPipeline),
      ProjectModel.countDocuments(query),
    ]);

    return { result, count };
  } catch (err) {
    console.error("[API] Project error:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch projects",
    });
  }
});
