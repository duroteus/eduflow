import { Router } from "express";
import multer from "multer";
import { MessageService } from "../services/message.service";

const messageService = new MessageService();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

const router = Router();

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const submissionData = {
      ...req.body,
      file: {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        buffer: Array.from(req.file.buffer),
      },
    };

    const response = await messageService.sendRequest("submission_requests", {
      action: "submission/create",
      data: submissionData,
    });

    res.json(response);
  } catch (error) {
    console.error("[API Gateway] Error creating submission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ... outras rotas ...
