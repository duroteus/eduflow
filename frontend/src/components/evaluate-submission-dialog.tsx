"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Submission } from "@/types/submission";
import { Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function EvaluateSubmissionDialog({
  submission,
  onEvaluated,
}: {
  submission: Submission;
  onEvaluated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState(submission.feedback || "");
  const [grade, setGrade] = useState<number | "">(submission.grade || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (grade === "" || grade < 0 || grade > 100) {
      toast.error("Por favor, insira uma nota válida (0-100)");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/submissions/${submission.id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "APPROVED",
            feedback,
            grade,
          }),
        }
      );

      if (!response.ok) throw new Error("Falha ao atualizar avaliação");

      toast.success("Trabalho avaliado com sucesso!");
      setOpen(false);
      onEvaluated();
    } catch (error) {
      console.error("Erro ao avaliar trabalho:", error);
      toast.error("Erro ao avaliar trabalho");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Eye className="h-4 w-4" />
      </Button>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Avaliar Trabalho</DialogTitle>
          <DialogDescription>
            {submission.title} - Enviado por: {submission.studentId}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição do Trabalho</Label>
            <p className="text-sm text-muted-foreground">
              {submission.description}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="grade">Nota (0-100)</Label>
            <Input
              id="grade"
              type="number"
              min="0"
              max="100"
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="col-span-3"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Forneça um feedback construtivo..."
              className="col-span-3"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Avaliando..." : "Confirmar Avaliação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
