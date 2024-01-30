import FilesModel from "~/server/models/Files";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    console.log(data);
    const obj = { id_files: data.files };
    const result = await FilesModel.find(obj);
    return result;
  } catch (err) {
    console.log(err);
  }
});
