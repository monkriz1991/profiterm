import { ensureConnection } from "~/server/utils/mongoose";
import ProjectModel from "~/server/models/Project";

export default defineEventHandler(async (event) => {
  try {
    await ensureConnection();
    const data = (await readBody(event)) || {};

    if (!data) {
      throw createError({
        statusCode: 400,
        message: "Project slug is required",
      });
    }

    const result = await ProjectModel.find({ kirilica: data }).lean();

    if (!result || result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Project not found",
      });
    }

    return result;
  } catch (err) {
    console.error("[API] Project item error:", err);
    if (err.statusCode) throw err;
    throw createError({
      statusCode: 500,
      message: "Failed to fetch project",
    });
  }
});
