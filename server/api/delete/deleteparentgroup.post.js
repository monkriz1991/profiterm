import ParentGroupModel from "~/server/models/ParentGroup";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const calk = await ParentGroupModel.deleteOne(data);
    return calk;
  } catch (err) {
    console.log(err);
  }
});
