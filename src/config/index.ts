import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, `./env/.env`),
});

export const CLICKUP_BOT_TOKEN = process.env.CLICKUP_BOT_TOKEN;
export const PORT = process.env.PORT || 1337;
