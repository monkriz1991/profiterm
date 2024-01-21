import { ref } from "vue";
import ProjectModel from "~/server/models/Project";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const project = await ProjectModel.replaceOne(obj, data);
    return project;
  } catch (err) {
    console.log(err);
  }
});
