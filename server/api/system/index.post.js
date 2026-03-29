import { ensureConnection } from "~/server/utils/mongoose";
import SystemModel from "~/server/models/System";

export default defineEventHandler(async (event) => {
  try {
    await ensureConnection();
    const data = await readBody(event);

    if (data && data.sortPage !== undefined) {
      const [result, count] = await Promise.all([
        SystemModel.find().skip(data.sortPage).limit(data.pageSize).lean(),
        SystemModel.countDocuments(),
      ]);
      return { result, count };
    } else {
      const result = await SystemModel.find().lean();
      return result;
    }
  } catch (err) {
    console.error("[API] System error:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch systems",
    });
  }
});
