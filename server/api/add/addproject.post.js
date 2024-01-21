import ProjectModel from "~/server/models/Project";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const project = await ProjectModel.create(data);
    return project;
  } catch (err) {
    console.log(err);
  }
});
