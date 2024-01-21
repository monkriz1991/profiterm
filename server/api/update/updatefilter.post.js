import { ref } from "vue";
import FilterModel from "~/server/models/Filter";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const filter = await FilterModel.replaceOne(obj, data);
    return filter;
  } catch (err) {
    console.log(err);
  }
});
