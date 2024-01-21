import MainModel from "~/server/models/Mainone";
import MainTwoModel from "~/server/models/Maintwo";
import MainThreeModel from "~/server/models/Mainthree";

export default defineEventHandler(async () => {
  try {
    const one = await MainModel.find();
    const two = await MainTwoModel.find();
    const three = await MainThreeModel.find();
    return { one, two, three };
  } catch (err) {
    console.log(err);
  }
});
