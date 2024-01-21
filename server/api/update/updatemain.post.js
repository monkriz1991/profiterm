import MainOneModel from "~/server/models/Mainone";
import MainTwoModel from "~/server/models/Maintwo";
import MainThreeModel from "~/server/models/Mainthree";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);
    const obj = { _id: data.form._id };
    if (data.form["type"] == "one") {
      const project = await MainOneModel.replaceOne(obj, data.form);
      return project;
    }
    if (data.form["type"] == "two") {
      const project = await MainTwoModel.replaceOne(obj, data.form);
      return project;
    }
    if (data.form["type"] == "three") {
      const project = await MainThreeModel.replaceOne(obj, data.form);
      return project;
    }
  } catch (err) {
    console.log(err);
  }
});
