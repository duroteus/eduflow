import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import { SubmissionController } from "./controllers/submission.controller";
import { errorMiddleware } from "./middleware/error.middleware";
import { submissionRoutes } from "./routes/submission.routes";
import { MessageService } from "./services/message.service";
import { QueueService } from "./services/queue.service";

dotenv.config();

const app = express();

const submissionController = new SubmissionController();
const messageService = new MessageService(submissionController);
const queueService = new QueueService(messageService, submissionController);

// Inicialize a conexão
messageService
  .connect()
  .then(() => queueService.setupConsumers())
  .catch(console.error);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[Server] ${req.method} ${req.path}`);
  next();
});

app.use("/api/submissions", submissionRoutes);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Submissions service running on port ${PORT}`);
});
