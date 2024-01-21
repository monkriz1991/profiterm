import { ref } from "vue";
import StageModel from "~/server/models/Stage";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data._id };
    const stage = await StageModel.replaceOne(obj, data);
    return stage;
  } catch (err) {
    console.log(err);
  }
});
