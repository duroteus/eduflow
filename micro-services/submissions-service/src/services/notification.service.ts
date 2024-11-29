import { Request, Response } from "express";
import { MessageService } from "./message.service";

class EmptyController {
  async list(req: Request, res: Response) {
    console.log("[EmptyController] List called with:", req.query);
    return res.json([]);
  }

  async create(req: Request, res: Response) {
    return res.json({});
  }

  async updateStatus(req: Request, res: Response) {
    return res.json({});
  }
}

export class NotificationService {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService(new EmptyController() as any);
  }

  async connect() {
    await this.messageService.connect();
  }

  async notifyNewSubmission(submission: any) {
    try {
      await this.messageService.sendToQueue("notification_requests", {
        action: "notification/create",
        data: {
          userId: submission.professorId,
          title: "Nova Submissão",
          message: `O aluno enviou o trabalho: ${submission.title}`,
          type: "submission_received",
          metadata: {
            submissionId: submission.id,
            studentId: submission.studentId,
            professorId: submission.professorId,
          },
        },
      });
    } catch (error) {
      console.error(
        "[NotificationService] Error notifying new submission:",
        error
      );
    }
  }

  async notifySubmissionEvaluated(submission: any) {
    try {
      console.log("[NotificationService] Enviando notificação:", {
        userId: submission.studentId,
        title: "Trabalho Avaliado",
        status: submission.status,
      });

      await this.messageService.sendToQueue("notification_requests", {
        action: "notification/create",
        data: {
          userId: submission.studentId,
          title: "Trabalho Avaliado",
          message: `Seu trabalho "${submission.title}" foi ${
            submission.status === "APPROVED" ? "aprovado" : "rejeitado"
          }${submission.grade ? ` com nota ${submission.grade}` : ""}`,
          type: "submission_evaluated",
          metadata: {
            submissionId: submission.id,
            studentId: submission.studentId,
            professorId: submission.professorId,
            status: submission.status,
            grade: submission.grade,
          },
        },
      });

      console.log("[NotificationService] Notificação enviada com sucesso");
    } catch (error) {
      console.error(
        "[NotificationService] Error notifying submission evaluated:",
        error
      );
    }
  }
}
