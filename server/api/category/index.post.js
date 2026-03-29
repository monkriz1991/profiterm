import { ensureConnection } from "~/server/utils/mongoose";
import CategoryModel from "~/server/models/Category";

export default defineEventHandler(async (event) => {
  try {
    await ensureConnection();
    const data = await readBody(event);

    if (data && data.sortPage !== undefined) {
      const [result, count] = await Promise.all([
        CategoryModel.find().skip(data.sortPage).limit(data.pageSize).lean(),
        CategoryModel.countDocuments(),
      ]);
      return { result, count };
    } else {
      const result = await CategoryModel.find().lean();
      return result;
    }
  } catch (err) {
    console.error("[API] Category error:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch categories",
    });
  }
});
