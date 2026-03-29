import { ensureConnection } from "~/server/utils/mongoose";
import AllPages from "~/server/models/Allpages";

export default defineEventHandler(async () => {
  try {
    await ensureConnection();
    const result = await AllPages.find().lean();
    return result;
  } catch (err) {
    console.error("[API] Allpages error:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch pages data",
    });
  }
});
