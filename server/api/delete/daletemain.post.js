import MainOneModel from "~/server/models/Mainone";
import MainTwoModel from "~/server/models/Maintwo";
import MainThreeModel from "~/server/models/Mainthree";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    if (data.obtype == "one") {
      const project = await MainOneModel.deleteOne({ _id: data._id });
      return project;
    }
    if (data.obtype == "two") {
      const project = await MainTwoModel.deleteOne({ _id: data._id });
      return project;
    }
    if (data.obtype == "three") {
      const project = await MainThreeModel.deleteOne({ _id: data._id });
      return project;
    }
  } catch (err) {
    console.log(err);
  }
});
