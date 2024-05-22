import { Request, Response } from "express";
import TelegramBot from "node-telegram-bot-api";

import { User } from "../database";
import { formatMessage } from "../services/formatMessage";

import { Data } from "../../types/types";

export const botNotification =
  (bot: TelegramBot, mess: string) => async (req: Request, res: Response) => {
    const data: Data = req.body;

    if (!data || !data.payload.assignees) {
      console.error("Invalid data format received from ClickUp.");
      res.sendStatus(400);
      return;
    }

    const assignees = data.payload.assignees.map((assignee) => assignee.email);

    try {
      const users = await User.findAll({
        where: {
          clickUpId: assignees,
        },
      });

      for (const user of users) {
        const message = formatMessage({
          data,
          messageName: mess,
        });

        await bot.sendMessage(user.telegramId, message, {
          parse_mode: "Markdown",
        });
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing webhook:", error, mess);
      res.sendStatus(500);
    }
  };
