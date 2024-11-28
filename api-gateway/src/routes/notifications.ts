import { Router } from "express";
import { MessageService } from "../services/message.service";

const router = Router();
const messageService = new MessageService();

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("[API Gateway] Listando notificações para userId:", userId);

    const response = await messageService.sendRequest("notification_requests", {
      action: "notification/list",
      data: { userId: String(userId) },
    });

    console.log("[API Gateway] Resposta do serviço de notificações:", response);
    res.json(response || []);
  } catch (error: any) {
    console.error("[API Gateway] Erro ao listar notificações:", error);
    res.status(500).json({ error: error.message });
  }
});

export { router as notificationRoutes };
