import ItemCalkModel from "~/server/models/ItemCalk";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const calk = await ItemCalkModel.create(data);
    return calk;
  } catch (err) {
    console.log(err);
  }
});
