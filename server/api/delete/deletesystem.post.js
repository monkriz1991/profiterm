import SystemModel from "~/server/models/System";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const system = await SystemModel.deleteOne(data);
    return system;
  } catch (err) {
    console.log(err);
  }
});
