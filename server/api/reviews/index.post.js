import { ensureConnection } from "~/server/utils/mongoose";
import ReviewsModel from "~/server/models/Reviews";

export default defineEventHandler(async (event) => {
  try {
    await ensureConnection();
    const data = (await readBody(event)) || {};

    if (data && data.Project) {
      const result = await ReviewsModel.find({ project: data.Project }).lean();
      return result;
    } else if (data && data.sortPage !== undefined) {
      const [result, count] = await Promise.all([
        ReviewsModel.find().skip(data.sortPage).limit(data.pageSize).lean(),
        ReviewsModel.countDocuments(),
      ]);
      return { result, count };
    } else {
      const result = await ReviewsModel.find().lean();
      return result;
    }
  } catch (err) {
    console.error("[API] Reviews error:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch reviews",
    });
  }
});
