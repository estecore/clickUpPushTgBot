import dotenv from "dotenv";

import express from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";

import { User } from "./database";
import {
  createTask,
  addComment,
  addAssignee,
  updatePriority,
  updateStatus,
} from "./controllers/webhooks";
import { setupBotHandlers } from "./controllers/botHandlers";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  console.error(
    "Could not find bot token in environment variables. Make sure it is in the .env file and named as TELEGRAM_BOT_TOKEN"
  );
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

app.use(bodyParser.json());

setupBotHandlers(bot);

app.post("/createtask", createTask(bot));
app.post("/addcomment", addComment(bot));
app.post("/assadd", addAssignee(bot));
app.post("/priority", updatePriority(bot));
app.post("/status", updateStatus(bot));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
