import { Assignee, Data, Watcher } from "../config/types";
import TelegramBot, { ChatId } from "node-telegram-bot-api";

import { UserClickUp } from "../database";

import formatMessage from "../utils/formatMessage";
import { emailPattern } from "../helpers";

const CLICKUP_BOT_TOKEN = process.env.CLICKUP_BOT_TOKEN;

if (!CLICKUP_BOT_TOKEN) {
  console.error(
    "Could not find bot token in environment variables. Make sure it is in the .env file and named as CLICKUP_BOT_TOKEN"
  );
  process.exit(1);
}

const clickupBot = new TelegramBot(CLICKUP_BOT_TOKEN, {
  polling: true,
});

const userStates: { [key: string]: string } = {};

class clickupBotService {
  public start() {
    const sendMainMenu = (
      chatId: ChatId,
      showRegisterButton: boolean = true
    ) => {
      const keyboard = showRegisterButton
        ? [
            [{ text: "Регистрация" }],
            [{ text: "Помощь" }],
            [{ text: "Удалиться" }],
          ]
        : [[{ text: "Помощь" }]];
      clickupBot.sendMessage(chatId.toString(), "Выберите команду:", {
        reply_markup: {
          keyboard,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    };

    clickupBot.onText(/\/start/, (msg: TelegramBot.Message) => {
      const chatId = msg.chat.id;
      clickupBot.sendMessage(
        chatId.toString(),
        `Добрый Вечер! Я бот для уведомлений о тасках в ClickUp.`
      );
      sendMainMenu(chatId);
    });

    clickupBot.onText(/\/register|Регистрация/, (msg: TelegramBot.Message) => {
      const chatId = msg.chat.id;
      userStates[chatId] = "awaiting_clickup_id";
      clickupBot.sendMessage(
        chatId.toString(),
        "Пожалуйста, введите свой корректный ClickUp E-mail для регистрации."
      );
    });

    clickupBot.onText(
      /\/delete|Удалиться/,
      async (msg: TelegramBot.Message) => {
        const chatId = msg.chat.id;
        userStates[chatId] = "awaiting_delete_email";
        clickupBot.sendMessage(
          chatId.toString(),
          "Пожалуйста, введите ваш ClickUp E-mail для подтверждения удаления."
        );
      }
    );

    clickupBot.onText(/\/help|Помощь/, (msg: TelegramBot.Message) => {
      const chatId = msg.chat.id;
      clickupBot.sendMessage(
        chatId.toString(),
        `Для регистрации нажмите на кнопку 'Регистрация'\n\nДля удаления аккаунта нажмите на кнопку 'Удалиться'`
      );
      sendMainMenu(chatId);
    });

    clickupBot.on("message", async (msg: TelegramBot.Message) => {
      const chatId = msg.chat.id;
      const email = msg.text;

      if (userStates[chatId] === "awaiting_clickup_id" && email) {
        if (!emailPattern.test(email)) {
          clickupBot.sendMessage(
            chatId.toString(),
            "Некорректный адрес электронной почты. Пожалуйста, введите корректный адрес."
          );
          return;
        }

        try {
          const candidat = await UserClickUp.findOne({
            where: { telegramId: chatId.toString() },
          });

          if (candidat) {
            candidat.clickUpId = email;
            await candidat.save();
            await clickupBot.sendMessage(
              chatId.toString(),
              "Ваш ClickUp E-mail обновлен!"
            );
            return;
          }

          const user = await UserClickUp.create({
            telegramId: chatId.toString(),
            clickUpId: email,
          });
          await user.save();
          await clickupBot.sendMessage(
            chatId.toString(),
            `Вы успешно зарегистрированы!\n\nТеперь Вы сможете получать уведомления о тасках прямо здесь прямо от меня!`
          );
        } catch (error) {
          console.error(error);
          await clickupBot.sendMessage(
            chatId.toString(),
            "Произошла ошибка при регистрации("
          );
        }

        delete userStates[chatId];
        sendMainMenu(chatId, false);
      }

      if (userStates[chatId] === "awaiting_delete_email" && email) {
        try {
          const user = await UserClickUp.findOne({
            where: { telegramId: chatId.toString() },
          });

          if (user?.clickUpId !== email) {
            await clickupBot.sendMessage(
              chatId.toString(),
              "Введённый вами ClickUp E-mail не совпадает с вашим зарегистрированным email."
            );
            return;
          }

          await UserClickUp.destroy({
            where: { telegramId: chatId.toString() },
          });
          await clickupBot.sendMessage(
            chatId.toString(),
            "Ваш аккаунт был успешно удалён из базы данных."
          );
        } catch (error) {
          console.log(error);
          await clickupBot.sendMessage(
            chatId.toString(),
            "Произошла ошибка при удалении аккаунта из базы данных."
          );
        }

        delete userStates[chatId];
        sendMainMenu(chatId, false);
      }
    });
  }

  public async newMessage(data: Data, message: string) {
    console.log(data);
    return new Promise(async (resolve, reject) => {
      try {
        if (!data || !data.payload.assignees) {
          console.error("Invalid data format received from ClickUp.");
          throw new Error("ERR");
        }
        const assignees = data.payload.assignees.map(
          (assignee: Assignee) => assignee.email
        );
        const watchers = data.payload.watchers.map(
          (watcher: Watcher) => watcher.email
        );
        const users =
          message === "Дедлайн наступил!"
            ? await UserClickUp.findAll({
                where: { clickUpId: assignees && watchers },
              })
            : await UserClickUp.findAll({
                where: { clickUpId: assignees },
              });

        for (const user of users) {
          const msg: string = formatMessage({
            data,
            messageName: message,
          });

          await clickupBot.sendMessage(user.telegramId, msg, {
            parse_mode: "Markdown",
          });
        }
        resolve(null);
      } catch (error) {
        console.error("Error processing webhook:", error, message);
        reject(error);
      }
    });
  }
}

export default new clickupBotService();
