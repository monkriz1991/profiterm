import multer from "multer";
import { callNodeListener } from "h3";

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    let filePaths = [];
    let fileNames = [];
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        //cb(null, "/var/www/cryptoscool.ru/images/");
        cb(null, config.FILES_PATH);
      },
      filename: (req, file, cbd) => {
        const filePath = file.originalname;
        filePaths.push(filePath);
        fileNames.push(file.originalname);
        cbd(null, filePath);
      },
    });

    const upload = multer({
      storage: storage,
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype == "image/png" ||
          file.mimetype == "image/jpeg" ||
          file.mimetype === "image/webp" ||
          file.mimetype === "video/mp4"
        ) {
          cb(null, true);
        } else {
          cb(new Error("Invalid file type"));
        }
      },
    });

    await callNodeListener(
      // @ts-expect-error: Nuxt 3
      upload.array("file", 10),
      event.node.req,
      event.node.res
    );
    const bulkOps = [];
    filePaths.forEach((fileName, index) => {
      const data = {
        insertOne: {
          document: {
            path: `/images/${fileName}`,
            fileName: fileNames[index],
          },
        },
      };
      bulkOps.push(data);
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
