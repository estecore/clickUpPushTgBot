import { Request, Response } from "express";
import { Data } from "../config/types";

import clickupBotService from "../services/clickupBotService";

class clickupBotController {
  async newTaskMessage(req: Request, res: Response) {
    try {
      const data: Data = req.body;
      await clickupBotService.newMessage(data, "Добавлена новая таска!");
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
  async newCommentMessage(req: Request, res: Response) {
    try {
      const data: Data = req.body;
      await clickupBotService.newMessage(data, "Добавлен новый комментарий!");
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
  async newAssigneeMessage(req: Request, res: Response) {
    try {
      const data: Data = req.body;
      await clickupBotService.newMessage(data, "Добавлен новый ответственный!");
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
  async changePriorityMessage(req: Request, res: Response) {
    try {
      const data: Data = req.body;
      await clickupBotService.newMessage(data, "Приоритет обновлён!");
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
  async changeStatusMessage(req: Request, res: Response) {
    try {
      const data: Data = req.body;
      await clickupBotService.newMessage(data, "Статус обновлён!");
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
  async dueDateMessage(req: Request, res: Response) {
    try {
      const data: Data = req.body;
      await clickupBotService.newMessage(data, "Дедлайн наступил!");
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
}

export default new clickupBotController();
