import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import multer from "multer";
import path from "path";
import { errorMiddleware } from "./middleware/error.middleware";
import { notificationRoutes } from "./routes/notifications";
import { MessageService } from "./services/message.service";

dotenv.config();
const app = express();
const messageService = new MessageService();

async function startServer() {
  try {
    await messageService.connect();

    app.use(
      cors({
        origin: ["http://localhost:3002"],
        methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    app.use(express.json());

    const upload = multer({ storage: multer.memoryStorage() });

    // Rotas usando mensageria
    app.get("/api/submissions", async (req, res) => {
      try {
        const { studentId, professorId } = req.query;
        console.log("[API Gateway] Recebendo request para listar submissões:", {
          studentId,
          professorId,
          queryType: typeof studentId,
          rawQuery: req.query,
          headers: req.headers,
        });

        const params = {
          ...(studentId ? { studentId: String(studentId) } : {}),
          ...(professorId ? { professorId: String(professorId) } : {}),
        };

        console.log("[API Gateway] Enviando request para o serviço:", params);
        const response = await messageService.sendRequest(
          "submission_requests",
          {
            action: "submission/list",
            data: params,
          }
        );

        console.log("[API Gateway] Resposta do serviço:", response);
        res.json(response || []);
      } catch (error: any) {
        console.error("[API Gateway] Erro ao listar submissões:", error);
        res.status(500).json({ error: error.message });
      }
    });

    app.patch("/api/submissions/:id/status", async (req, res) => {
      try {
        console.log("[API Gateway] Atualizando submissão:", {
          id: req.params.id,
          ...req.body,
        });
        const response = await messageService.sendRequest("submission/update", {
          id: req.params.id,
          ...req.body,
        });
        res.json(response);
      } catch (error: any) {
        console.error("[API Gateway] Erro ao atualizar submissão:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // Rotas de autenticação
    app.post("/api/auth/signup", async (req, res) => {
      try {
        const response = await messageService.sendRequest(
          "user/create",
          req.body
        );
        res.json(response);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post("/api/auth/signin", async (req, res) => {
      try {
        console.log("[API Gateway] Signin request:", req.body);
        const response = await messageService.sendRequest("user_requests", {
          action: "user/signin",
          data: req.body,
        });
        console.log("[API Gateway] Signin response:", response);
        res.json(response);
      } catch (error: any) {
        console.error("[API Gateway] Signin error:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // Rota para criar submissão
    app.post("/api/submissions", upload.single("file"), async (req, res) => {
      try {
        console.log("[API Gateway] Recebendo submissão:", {
          body: req.body,
          file: req.file
            ? {
                name: req.file.originalname,
                type: req.file.mimetype,
                size: req.file.size,
              }
            : null,
        });

        const submission = {
          ...req.body,
          file: req.file
            ? {
                name: req.file.originalname,
                type: req.file.mimetype,
                size: req.file.size,
                buffer: req.file.buffer,
              }
            : null,
        };

        const response = await messageService.sendRequest(
          "submission/create",
          submission
        );
        console.log("[API Gateway] Resposta da criação:", response);
        res.json(response);
      } catch (error) {
        console.error("[API Gateway] Erro detalhado:", error);
        res.status(500).json({ message: "Error creating submission" });
      }
    });

    // Servir arquivos estáticos
    app.use(
      "/uploads",
      express.static(
        path.join(
          __dirname,
          "..",
          "..",
          "micro-services",
          "submissions-service",
          "uploads"
        ),
        {
          setHeaders: (res) => {
            res.setHeader("Content-Disposition", "attachment");
          },
        }
      )
    );

    // Rota para listar usuários
    app.get("/api/users", async (req, res) => {
      try {
        const { role } = req.query;
        console.log("[API Gateway] Listando usuários:", { role });

        const response = await messageService.sendRequest("user_requests", {
          action: "user/list",
          data: { role: String(role) },
        });
        res.json(response);
      } catch (error: any) {
        console.error("[API Gateway] Erro ao listar usuários:", error);
        res.status(500).json({ error: error.message });
      }
    });

    // Rotas de notificações
    app.use("/api/notifications", notificationRoutes);

    app.patch("/api/notifications/:id/mark-read", async (req, res) => {
      try {
        const { id } = req.params;
        const response = await messageService.sendRequest(
          "notification/mark-read",
          { id }
        );
        res.json(response);
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    app.use(errorMiddleware);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`API Gateway running on port ${PORT}`);
    });
  } catch (error) {
    console.error("[API Gateway] Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
