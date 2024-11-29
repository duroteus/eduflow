"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { StudentSubmissionsList } from "@/components/student-submissions-list";
import { SubmitWorkForm } from "@/components/submit-work-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AlunoDashboardPage() {
  const [open, setOpen] = useState(false);

  const handleSubmissionCreated = () => {
    setOpen(false); // Fecha o modal após submissão
  };

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Meus Trabalhos
            </h2>
            <p className="text-muted-foreground">
              Gerencie suas submissões de trabalhos
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Trabalho
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Enviar Novo Trabalho</DialogTitle>
              </DialogHeader>
              <SubmitWorkForm onSubmissionCreated={handleSubmissionCreated} />
            </DialogContent>
          </Dialog>
        </div>

        <StudentSubmissionsList />
      </div>
    </DashboardShell>
  );
}
