// // // fetchData.js
// import { defineNuxtPlugin } from "#app";
// import https from "https"; // Используем импорт вместо require

// const fetchData = async () => {
//   const options = {
//     hostname: "cryptoscool.ru",
//     port: 443,
//     path: "/",
//     method: "GET",
//     rejectUnauthorized: false, // отключение проверки сертификата
//   };

//   return new Promise((resolve, reject) => {
//     const req = https.request(options, (res) => {
//       let data = "";

//       res.on("data", (chunk) => {
//         data += chunk;
//       });

//       res.on("end", () => {
//         resolve(data);
//       });
//     });

//     req.on("error", (error) => {
//       reject(error);
//     });

//     req.end();
//   });
// };

// export default defineNuxtPlugin((nuxtApp) => {
//   fetchData()
//     .then((data) => {
//       // console.log("Полученные данные:", data);
//       // Здесь вы можете сделать что-то с полученными данными
//     })
//     .catch((error) => {
//       // console.error("Ошибка при получении данных:", error);
//     });
// });
