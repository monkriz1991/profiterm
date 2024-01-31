import fs from "fs";
export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    console.log(data.img);
    data.img.forEach((fileName, index) => {
      fs.unlinkSync(`public${fileName}`);
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
