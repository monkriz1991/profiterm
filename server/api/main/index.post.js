import { ensureConnection } from "~/server/utils/mongoose";
import MainModel from "~/server/models/Mainone";
import MainTwoModel from "~/server/models/Maintwo";
import MainThreeModel from "~/server/models/Mainthree";

export default defineEventHandler(async () => {
  try {
    await ensureConnection();

    const [one, two, three] = await Promise.all([
      MainModel.find().lean(),
      MainTwoModel.find().lean(),
      MainThreeModel.find().lean(),
    ]);

    return { one, two, three };
  } catch (err) {
    console.error("[API] Main error:", err);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch main data",
    });
  }
});
