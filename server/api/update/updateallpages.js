import { ref } from "vue";
import Allpages from "~/server/models/Allpages";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    // Проверяем наличие _id
    if (!data._id) {
      // Если _id отсутствует, создаем новую запись
      const newRecord = new Allpages(data);
      const result = await newRecord.save();
      return result;
    }

    const obj = { _id: data._id };

    // Выполняем поиск документа по _id и обновление или создание нового
    let result = await Allpages.findOneAndUpdate(
      obj, // Условие поиска
      data, // Новые данные для обновления или создания
      { upsert: true, new: true } // Опции: upsert - создание нового, если не найдено; new - возвращает обновленный документ
    );

    return result;
  } catch (err) {
    console.error(err);
    throw err; // Пробрасываем ошибку для обработки на вышестоящем уровне
  }
});
