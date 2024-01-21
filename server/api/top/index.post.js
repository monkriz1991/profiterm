import ProjectModel from "~/server/models/Project";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    const obj = { show_index: true };
    const result = await ProjectModel.find(obj);
    return result;
  } catch (err) {
    console.log(err);
  }
});
