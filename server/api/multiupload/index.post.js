import multer from "multer";
import { callNodeListener, createError } from "h3";

export default defineEventHandler(async (event) => {
  try {
    let filePaths = [];
    let fileNames = [];

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "/var/www/disk.cryptoscool.ru/public_html/images/");
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
          file.mimetype === "image/mp4"
        ) {
          cb(null, true);
        } else {
          cb(new Error("Invalid file type"));
        }
      },
    });

    // Обработка загрузки файлов
    await callNodeListener(
      upload.array("file", 10),
      event.node.req,
      event.node.res
    );

    // Логика сохранения информации о файлах в базу данных
    const bulkOps = filePaths.map((fileName, index) => ({
      insertOne: {
        document: {
          path: `/images/${fileName}`,
          fileName: fileNames[index],
        },
      },
    }));

    // Пример логики сохранения в базу данных (предполагается MongoDB)
    const db = await getDbConnection(); // Замените на ваш метод подключения к базе данных
    await db.collection("files").bulkWrite(bulkOps);

    return 200;
  } catch (error) {
    console.error(error);

    // Вывод ошибки в консоль сервера для отладки
    console.error("Error processing request:", error.message);

    // Передача ошибки клиенту с деталями в ответе
    return createError({
      statusCode: 500,
      statusMessage: `Something went wrong: ${error.message}`,
    });
  }
});
