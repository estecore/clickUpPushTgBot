import express from "express";

import { PORT } from "./config";

import clickupRoutes from "./routes/clickupRoutes";

import clickupBotService from "./services/clickupBotService";

const app = express();

const port = PORT || 1337;

app.use("/clickup/", clickupRoutes);

clickupBotService.start();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
