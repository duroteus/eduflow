import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export class NotificationController {
  async create(req: Request, res: Response) {
    const { userId, title, message, type, metadata } = req.body;

    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          metadata,
        },
      });

      return res.status(201).json(notification);
    } catch (error) {
      console.error("[NotificationController] Create error:", error);
      return res.status(500).json({ error: "Error creating notification" });
    }
  }

  async list(req: Request, res: Response) {
    const { userId } = req.query;

    try {
      console.log(
        "[NotificationController] Listando notificações para:",
        userId
      );

      const notifications = await prisma.notification.findMany({
        where: {
          userId: String(userId),
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log(
        "[NotificationController] Notificações encontradas:",
        notifications.length
      );
      return res.json(notifications);
    } catch (error) {
      console.error(
        "[NotificationController] Error listing notifications:",
        error
      );
      return res.status(500).json({ message: "Error listing notifications" });
    }
  }

  async markAsRead(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const notification = await prisma.notification.update({
        where: { id },
        data: { read: true },
      });

      return res.json(notification);
    } catch (error) {
      console.error("[NotificationController] MarkAsRead error:", error);
      return res
        .status(500)
        .json({ error: "Error marking notification as read" });
    }
  }
}
