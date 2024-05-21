import TelegramBot, { ChatId } from "node-telegram-bot-api";

import { User } from "../database";

const userStates: { [key: string]: string } = {};

export const setupBotHandlers = (bot: TelegramBot) => {
  const sendMainMenu = (chatId: ChatId) => {
    bot.sendMessage(chatId.toString(), "Выберите команду:", {
      reply_markup: {
        keyboard: [[{ text: "Регистрация" }], [{ text: "Помощь" }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  };

  bot.onText(/\/start/, (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId.toString(),
      `Добрый Вечер! Я бот для уведомлений о тасках в ClickUp.`
    );
    sendMainMenu(chatId);
  });

  bot.onText(/\/register|Регистрация/, (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    userStates[chatId] = "awaiting_clickup_id";
    bot.sendMessage(
      chatId.toString(),
      "Пожалуйста, введите свой ClickUp E-mail для регистрации."
    );
  });

  bot.onText(/\/help|Помощь/, (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId.toString(),
      "Для регистрации нажмите на кнопку 'Регистрация' и следуйте инструкциям."
    );
    sendMainMenu(chatId);
  });

  bot.on("message", async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
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
            chatId.toString(),
            `Вы успешно зарегистрированы!\n\nТеперь Вы сможете получать уведомления о тасках прямо здесь прямо от меня!`
          );
        } else {
          user.clickUpId = clickUpId;
          await user.save();
          bot.sendMessage(chatId.toString(), "Ваш ClickUp E-mail обновлен!");
        }
      } catch (error) {
        console.error(error);
        bot.sendMessage(chatId.toString(), "Произошла ошибка при регистрации(");
      }

      delete userStates[chatId];
      sendMainMenu(chatId);
    }
  });
};
