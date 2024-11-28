import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import { MessageService } from "./services/message.service";

dotenv.config();

const app = express();
const messageService = new MessageService();

// Inicialize a conexão
messageService.connect().catch(console.error);

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

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Users service running on port ${PORT}`);
});
