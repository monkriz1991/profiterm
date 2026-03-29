import { Nitro } from "nitropack";
import { ensureConnection } from "./utils/mongoose";

export default async (_nitroApp: Nitro) => {
  try {
    await ensureConnection();
  } catch (e) {
    console.error("[MongoDB] Initial connection failed:", e);
  }
};
