import { ref } from "vue";
import SystemModel from "~/server/models/System";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const system = await SystemModel.replaceOne(obj, data);
    return system;
  } catch (err) {
    console.log(err);
  }
});
