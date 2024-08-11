import ParentGroupModel from "~/server/models/ParentGroup";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const calk = await ParentGroupModel.replaceOne(obj, data);
    return calk;
  } catch (err) {
    console.log(err);
  }
});
