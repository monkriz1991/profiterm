import TypeCalkModel from "~/server/models/TypeCalk";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const calk = await TypeCalkModel.replaceOne(obj, data);
    return calk;
  } catch (err) {
    console.log(err);
  }
});
