import { ensureConnection } from "~/server/utils/mongoose";
import NewsModel from "~/server/models/News";

export default defineEventHandler(async (event) => {
  try {
    await ensureConnection();
    const data = await readBody(event);

    if (!data) {
      throw createError({
        statusCode: 400,
        message: "News slug is required",
      });
    }

    const result = await NewsModel.findOne({ kirilica: data }).lean();

    if (!result) {
      throw createError({
        statusCode: 404,
        message: "News item not found",
      });
    }

    return result;
  } catch (err) {
    console.error("[API] News item error:", err);
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 500,
      message: "Failed to fetch news item",
    });
  }
});
