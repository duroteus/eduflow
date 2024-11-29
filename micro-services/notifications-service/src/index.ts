import "express-async-errors";
import { MessageService } from "./services/message.service";

const messageService = new MessageService();

// Conectar ao RabbitMQ e iniciar o serviço
async function start() {
  try {
    await messageService.connect();
    console.log("[NotificationService] Service started successfully");
  } catch (error) {
    console.error("[NotificationService] Failed to start service:", error);
    process.exit(1);
  }
}

// Lidar com erros não tratados
process.on("uncaughtException", (error) => {
  console.error("[NotificationService] Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("[NotificationService] Unhandled Rejection:", error);
  process.exit(1);
});

// Iniciar o serviço
start().catch((error) => {
  console.error("[NotificationService] Startup error:", error);
  process.exit(1);
});
