import ElementCalkModel from "~/server/models/ElementCalk";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const calk = await ElementCalkModel.deleteOne(data);
    return calk;
  } catch (err) {
    console.log(err);
  }
});
