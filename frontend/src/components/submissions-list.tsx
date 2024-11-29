"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { Submission } from "@/types/submission";
import { Download, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { EvaluateSubmissionDialog } from "./evaluate-submission-dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function SubmissionsList() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubmissions = useCallback(async () => {
    try {
      console.log(
        "[SubmissionsList] Buscando submissões para professor:",
        user?.id
      );
      const response = await fetch(
        `${API_URL}/api/submissions?professorId=${user?.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar submissões");
      }

      const data = await response.json();
      console.log("Submissões recebidas:", data);

      if (!Array.isArray(data)) {
        console.error("Dados recebidos não são um array:", data);
        setSubmissions([]);
        return;
      }

      setSubmissions(data);
    } catch (error) {
      console.error("Erro ao carregar submissões:", error);
      toast.error("Erro ao carregar submissões");
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: "bg-yellow-500 hover:bg-yellow-600",
      APPROVED: "bg-green-500 hover:bg-green-600",
      REJECTED: "bg-red-500 hover:bg-red-600",
    };

    const labels = {
      PENDING: "Pendente",
      APPROVED: "Aprovado",
      REJECTED: "Rejeitado",
    };

    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = async (submission: Submission) => {
    try {
      const response = await fetch(submission.file.url);
      if (!response.ok) throw new Error("Erro ao baixar arquivo");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = submission.file.name;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
      toast.error("Erro ao baixar arquivo");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          placeholder="Pesquisar por título ou aluno..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />

        <div className="grid gap-4">
          {filteredSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="space-y-1">
                    <h3 className="font-medium">{submission.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {submission.description}
                    </p>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(submission.status)}
                      {submission.grade && (
                        <span className="text-sm">
                          Nota: {submission.grade}/100
                        </span>
                      )}
                    </div>
                    {submission.feedback && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Feedback:</strong> {submission.feedback}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <EvaluateSubmissionDialog
                      submission={submission}
                      onEvaluated={fetchSubmissions}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDownload(submission)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredSubmissions.length === 0 && (
            <p className="text-center text-muted-foreground">
              Nenhuma submissão encontrada
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
