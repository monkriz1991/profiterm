import Stage from "~/server/models/Stage";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const stage = await Stage.deleteOne(data);
    return stage;
  } catch (err) {
    console.log(err);
  }
});
