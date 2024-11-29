import { Status } from "@prisma/client";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { prisma } from "../config/database";
import { NotificationService } from "../services/notification.service";
import { S3Service } from "../services/s3.service";

const s3Service = new S3Service();

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

export class SubmissionController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
    this.notificationService.connect().catch((error) => {
      console.error(
        "[SubmissionController] Failed to connect to RabbitMQ:",
        error
      );
    });
  }

  async create(req: Request, res: Response) {
    const { title, description, studentId, professorId, file } = req.body;

    try {
      if (!file || !file.buffer) {
        return res.status(400).json({ message: "File is required" });
      }

      // Converter o array de volta para Buffer
      const fileBuffer = Buffer.from(file.buffer);
      const fileKey = `${studentId}/${randomUUID()}-${file.name}`;

      const fileUrl = await s3Service.uploadFile(
        fileKey,
        fileBuffer,
        file.type
      );

      const submission = await prisma.submission.create({
        data: {
          title,
          description,
          studentId,
          professorId,
          status: Status.PENDING,
          file: {
            create: {
              name: file.name,
              type: file.type,
              size: file.size,
              key: fileKey,
              url: fileUrl,
            },
          },
        },
        include: {
          file: true,
        },
      });

      // Notificar professor
      await this.notificationService.notifyNewSubmission(submission);

      return res.status(201).json(submission);
    } catch (error) {
      console.error("[SubmissionController] Error:", error);
      return res.status(500).json({ message: "Error creating submission" });
    }
  }

  async list(req: Request, res: Response) {
    const { studentId, professorId } = req.query;

    try {
      console.log("[SubmissionController] Recebido request com:", {
        studentId,
        professorId,
        queryType: typeof studentId,
      });

      const where = studentId
        ? { studentId: { equals: String(studentId) } }
        : professorId
        ? { professorId: { equals: String(professorId) } }
        : {};

      console.log("[SubmissionController] Filtros finais:", where);

      const submissions = await prisma.submission.findMany({
        where,
        include: { file: true },
        orderBy: { submittedAt: "desc" },
      });

      console.log("[SubmissionController] Query retornou:", {
        count: submissions.length,
        submissions: submissions.map((s) => ({
          id: s.id,
          studentId: s.studentId,
        })),
      });

      return res.json(submissions);
    } catch (error) {
      console.error("[SubmissionController] Erro ao listar submissões:", error);
      return res.status(500).json({ error: "Error listing submissions" });
    }
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status, feedback, grade } = req.body;

    try {
      const submission = await prisma.submission.update({
        where: { id },
        data: {
          status,
          feedback: feedback || null,
          grade: grade !== undefined ? Number(grade) : null,
        },
        include: { file: true },
      });

      // Adicionar logs para debug
      console.log("[SubmissionController] Enviando notificação de avaliação");
      await this.notificationService.notifySubmissionEvaluated(submission);
      console.log("[SubmissionController] Notificação enviada com sucesso");

      return res.json(submission);
    } catch (error) {
      console.error("[SubmissionController] Error:", error);
      return res.status(500).json({ message: "Error updating submission" });
    }
  }
}
