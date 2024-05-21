import dotenv from "dotenv";

import express from "express";
import bodyParser from "body-parser";
import TelegramBot from "node-telegram-bot-api";

import { User } from "./database";
import {
  createTask,
  addAssignee,
  updateStatus,
  updatePriority,
} from "./controllers/webhooks";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  console.error(
    "Не удалось найти токен бота в переменных окружения. Убедитесь, что он находится в файле .env и назван как TELEGRAM_BOT_TOKEN"
  );
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

app.use(bodyParser.json());

bot.onText(/\/start/, (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id.toString();
  bot.sendMessage(
    chatId,
    `Добрый Вечер! Я бот для уведомлений о тасках в ClickUp. \n\nНапишите мне "/register" и следуйте инструкциям.`
  );
});

const userStates: { [key: string]: string } = {};

bot.onText(/\/register/, (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id.toString();

  userStates[chatId] = "awaiting_clickup_id";

  bot.sendMessage(
    chatId,
    "Пожалуйста, введи свой ClickUp email для регистрации."
  );
});

bot.on("message", async (msg: TelegramBot.Message) => {
  const chatId = msg.chat.id.toString();
  const text = msg.text;

  if (userStates[chatId] === "awaiting_clickup_id" && text) {
    const clickUpId = text;

    try {
      const [user, created] = await User.findOrCreate({
        where: { telegramId: chatId },
        defaults: { clickUpId },
      });

      if (created) {
        bot.sendMessage(chatId, "Вы успешно зарегистрированы!");
      } else {
        user.clickUpId = clickUpId;
        await user.save();
        bot.sendMessage(chatId, "Ваш ClickUp email обновлен!");
      }
    } catch (error) {
      console.error(error);
      bot.sendMessage(chatId, "Произошла ошибка при регистрации(");
    }

    delete userStates[chatId];
  }
});

app.post("/createtask", createTask(bot));
app.post("/assadd", addAssignee(bot));
app.post("/status", updateStatus(bot));
app.post("/priority", updatePriority(bot));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
