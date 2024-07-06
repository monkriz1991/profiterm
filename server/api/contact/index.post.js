import nodemailer from "nodemailer";
const config = useRuntimeConfig();

const transporter = nodemailer.createTransport({
  host: config.MAILHOST,
  port: config.MAILPORT,
  secure: false,
  auth: {
    user: config.MAILUSER,
    pass: config.MAILPASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default defineEventHandler(async (event, response) => {
  try {
    const body = await readBody(event);
    const mail = {
      from: `"Заявка с сайта" <${config.MAILUSER}>`,
      to: config.CONTACTMAIL,
      subject: "Заявка с сайта Профитерм",
      text: body.info,
      html: `
        / Имя / ${body.name} <br>
        / Телефон / ${body.phone} <br>
        / Email / ${body.email} <br>
        / Адрес объекта / ${body.info} <br>
        / Комментарий / ${body.description} <br>
      `,
    };

    const mailClient = {
      from: `"Заявка с сайта" <${config.MAILUSER}>`,
      to: body.email,
      subject: "Заявка с сайта",
      text: body.info,
      html: body.description,
    };

    await transporter.sendMail(mail);
    //await transporter.sendMail(mailClient);
  } catch (err) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: err.message,
      })
    );
  }
});
