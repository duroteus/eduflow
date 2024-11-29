import { Router } from "express";
import multer from "multer";
import { SubmissionController } from "../controllers/submission.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const controller = new SubmissionController();

// Adicionar logs para debug
router.use((req, res, next) => {
  console.log(`[Submission Routes] ${req.method} ${req.path}`, {
    body: req.body,
    params: req.params,
  });
  next();
});

router.post("/", upload.single("file"), controller.create.bind(controller));
router.get("/", controller.list.bind(controller));
router.patch("/:id/status", controller.updateStatus.bind(controller));

export const submissionRoutes = router;
