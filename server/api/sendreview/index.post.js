import nodemailer from "nodemailer";
import formidable from "formidable";
import fs from "fs";

const config = useRuntimeConfig();

const transporter = nodemailer.createTransport({
  host: config.MAILHOST,
  port: config.MAILPORT,
  auth: {
    user: config.MAILUSER,
    pass: config.MAILPASSWORD,
  },
});

export default defineEventHandler(async (event) => {
  try {
    const form = formidable({ multiples: true });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event.req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });
    console.log(fields);
    // Extract subject and text from arrays if they are arrays
    const subject = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const text = Array.isArray(fields.info) ? fields.info[0] : fields.info;

    let attachments = [];

    if (files.file) {
      const filearr = files.file;
      const file = filearr[0];
      if (file && file.filepath) {
        // Чтение файла синхронно
        let fileContent = fs.readFileSync(file.filepath);

        // Убедимся, что fileContent не является массивом (если так, преобразуем в Buffer)
        if (Array.isArray(fileContent)) {
          fileContent = Buffer.concat(fileContent); // Преобразуем массив в Buffer
        }

        attachments.push({
          filename: file.originalFilename,
          content: fileContent, // Используем содержимое файла (Buffer)
        });
      }
    }

    const mail = {
      from: `"${fields.name}" <${fields.email}>`,
      to: config.CONTACTMAIL,
      subject: subject,
      text: text,
      html: `
        / Имя / ${fields.name} <br>
        / Телефон / ${fields.phone} <br>
        / Email / ${fields.email} <br>
        / Текст отзыва / ${fields.description} <br>
      `,
      attachments,
    };
    await transporter.sendMail(mail);
  } catch (error) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: error.message,
      })
    );
  }
});
