import TelegramBot from "node-telegram-bot-api";
import { User } from "../database";

const userStates: { [key: string]: string } = {};

export const setupBotHandlers = (bot: TelegramBot) => {
  bot.onText(/\/start/, (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id.toString();
    bot.sendMessage(
      chatId,
      `Добрый Вечер! Я бот для уведомлений о тасках в ClickUp. \n\nНапишите мне "/register" и следуйте инструкциям.`
    );
  });

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
          bot.sendMessage(
            chatId,
            `Вы успешно зарегистрированы!\n\nТеперь Вы сможете получать уведомления о тасках прямо здесь прямо от меня!`
          );
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
};
