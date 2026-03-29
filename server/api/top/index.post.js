import { ensureConnection } from "~/server/utils/mongoose";
import ProjectModel from "~/server/models/Project";

export default defineEventHandler(async () => {
  try {
    await ensureConnection();
    const result = await ProjectModel.find({ show_index: true }).lean();
    return result;
  } catch (err) {
    console.error("[API] Top projects error:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch top projects",
    });
  }
});
