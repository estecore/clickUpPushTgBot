import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  console.error(
    "Could not find bot token in environment variables. Make sure it is in the .env file and named as TELEGRAM_BOT_TOKEN"
  );
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log(`Your chat ID is: ${chatId}`);
  bot.sendMessage(chatId, `Your chat ID is: ${chatId}`);
});
