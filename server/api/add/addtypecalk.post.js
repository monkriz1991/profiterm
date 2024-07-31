import TypeCalkModel from "~/server/models/TypeCalk";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const calk = await TypeCalkModel.create(data);
    return calk;
  } catch (err) {
    console.log(err);
  }
});
