import { Request, Response } from "express";
import TelegramBot from "node-telegram-bot-api";

import { User } from "../database";
import { formatMessage } from "../services/formatMessage";

import { Data } from "../../types/types";

export const createTask =
  (bot: TelegramBot) => async (req: Request, res: Response) => {
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
          messageName: "Created new Task!",
        });

        await bot.sendMessage(user.telegramId, message, {
          parse_mode: "Markdown",
        });
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing create task webhook:", error);
      res.sendStatus(500);
    }
  };

export const addComment =
  (bot: TelegramBot) => async (req: Request, res: Response) => {
    const data: Data = req.body;

    console.log(data);

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
          messageName: "Add new Comment!",
        });

        await bot.sendMessage(user.telegramId, message, {
          parse_mode: "Markdown",
        });
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing add comment webhook:", error);
      res.sendStatus(500);
    }
  };

export const addAssignee =
  (bot: TelegramBot) => async (req: Request, res: Response) => {
    const data: Data = req.body;

    if (!data || !data.payload.assignees) {
      console.error("Invalid data format received from ClickUp.");
      return res.sendStatus(400);
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
          messageName: "Add new Assignee!",
        });

        await bot.sendMessage(user.telegramId, message, {
          parse_mode: "Markdown",
        });
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing add assignee webhook:", error);
      res.sendStatus(500);
    }
  };

export const updatePriority =
  (bot: TelegramBot) => async (req: Request, res: Response) => {
    const data: Data = req.body;

    if (!data || !data.payload.assignees) {
      console.error("Invalid data format received from ClickUp.");
      return res.sendStatus(400);
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
          messageName: "Priority updated!",
        });

        await bot.sendMessage(user.telegramId, message, {
          parse_mode: "Markdown",
        });
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing priority update webhook:", error);
      res.sendStatus(500);
    }
  };

export const updateStatus =
  (bot: TelegramBot) => async (req: Request, res: Response) => {
    const data: Data = req.body;

    if (!data || !data.payload.assignees) {
      console.error("Invalid data format received from ClickUp.");
      return res.sendStatus(400);
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
          messageName: "Status updated!",
        });

        await bot.sendMessage(user.telegramId, message, {
          parse_mode: "Markdown",
        });
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Error processing status update webhook:", error);
      res.sendStatus(500);
    }
  };
