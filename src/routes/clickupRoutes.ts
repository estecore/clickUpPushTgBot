import express from "express";
import clickupBotController from "../controllers/clickupBotController";

const router = express.Router();

router.post("/createtask", clickupBotController.newTaskMessage);
router.post("/addcomment", clickupBotController.newCommentMessage);
router.post("/assadd", clickupBotController.newAssigneeMessage);
router.post("/priority", clickupBotController.changePriorityMessage);
router.post("/status", clickupBotController.changeStatusMessage);
router.post("/duedate", clickupBotController.dueDateMessage);

export default router;
