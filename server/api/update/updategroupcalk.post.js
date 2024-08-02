import GroupCalkModel from "~/server/models/GroupCalk";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const calk = await GroupCalkModel.replaceOne(obj, data);
    return calk;
  } catch (err) {
    console.log(err);
  }
});
