import ItemCalkModel from "~/server/models/ItemCalk";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const calk = await ItemCalkModel.replaceOne(obj, data);
    return calk;
  } catch (err) {
    console.log(err);
  }
});
