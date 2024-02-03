import fs from "fs";
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const data = await readBody(event);
    data.img.forEach((fileName, index) => {
      fs.unlinkSync(`${config.FILES_PATH}${fileName.name}`);
    });
    return 200;
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 500,
      statusMessage: "Something went wrong.",
    });
  }
});
