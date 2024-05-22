import dotenv from "dotenv";

import express from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";

import { botNotification } from "./controllers/webhooks";
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

app.post("/createtask", botNotification(bot, "Добавлена новая таска!"));
app.post("/addcomment", botNotification(bot, "Добавлен новый комментарий!"));
app.post("/assadd", botNotification(bot, "Добавлен новый ответственный!"));
app.post("/priority", botNotification(bot, "Приоритет обновлён!"));
app.post("/status", botNotification(bot, "Статус обновлён!"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
