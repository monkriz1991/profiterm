import GroupCalkModel from "~/server/models/GroupCalk";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const calk = await GroupCalkModel.deleteOne(data);
    return calk;
  } catch (err) {
    console.log(err);
  }
});
