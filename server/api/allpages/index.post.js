import AllPages from "~/server/models/Allpages";

export default defineEventHandler(async () => {
  try {
    const result = await AllPages.find();
    return result;
  } catch (err) {
    console.log(err);
  }
});
