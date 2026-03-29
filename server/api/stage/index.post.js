import { ensureConnection } from "~/server/utils/mongoose";
import StageModel from "~/server/models/Stage";

export default defineEventHandler(async (event) => {
  try {
    await ensureConnection();
    const data = await readBody(event);

    if (data && data.sortPage !== undefined && !data.Project) {
      const [result, count] = await Promise.all([
        StageModel.find().skip(data.sortPage).limit(data.pageSize).lean(),
        StageModel.countDocuments(),
      ]);
      return { result, count };
    } else {
      const result = await StageModel.find().sort({ level: 1 }).lean();
      return result;
    }
  } catch (err) {
    console.error("[API] Stage error:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch stages",
    });
  }
});
