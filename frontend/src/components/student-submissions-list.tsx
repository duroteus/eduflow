"use client";

import { useAuth } from "@/contexts/auth-context";
import { Submission } from "@/types/submission";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, FileText, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { StatsCard } from "./stats-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface StudentSubmissionsListProps {
  onSubmissionsChange?: (submissions: Submission[]) => void;
}

export function StudentSubmissionsList({
  onSubmissionsChange,
}: StudentSubmissionsListProps) {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSubmissions = useCallback(async () => {
    try {
      if (!user?.id) {
        console.error("Usuário não autenticado");
        return;
      }

      console.log(
        "[StudentSubmissionsList] Buscando trabalhos para o aluno:",
        user?.id
      );
      const response = await fetch(
        `${API_URL}/api/submissions?studentId=${user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao carregar trabalhos");
      }

      const data = await response.json();
      const submissionsArray = Array.isArray(data) ? data : [];
      setSubmissions(submissionsArray);
      onSubmissionsChange?.(submissionsArray);
    } catch (error) {
      console.error("Erro ao carregar trabalhos:", error);
      toast.error("Erro ao carregar trabalhos");
    } finally {
      setLoading(false);
    }
  }, [user?.id, onSubmissionsChange]);

  useEffect(() => {
    if (user?.id) {
      fetchSubmissions();
    }
  }, [user?.id, fetchSubmissions]);

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

  const filteredSubmissions = submissions.filter((submission) =>
    submission.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Trabalhos"
          value={submissions.length}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Trabalhos Pendentes"
          value={submissions.filter((s) => s.status === "PENDING").length}
          description="Aguardando avaliação"
        />
        <StatsCard
          title="Trabalhos Aprovados"
          value={submissions.filter((s) => s.status === "APPROVED").length}
        />
        <StatsCard
          title="Trabalhos Rejeitados"
          value={submissions.filter((s) => s.status === "REJECTED").length}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Trabalhos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Pesquisar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <div className="space-y-4">
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum trabalho encontrado
                </div>
              ) : (
                filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{submission.title}</h3>
                        {getStatusBadge(submission.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {submission.description}
                      </p>
                      {submission.grade && (
                        <p className="text-sm font-medium">
                          Nota: {submission.grade}/100
                        </p>
                      )}
                      {submission.feedback && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Feedback:</strong> {submission.feedback}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Enviado{" "}
                        {formatDistanceToNow(new Date(submission.submittedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDownload(submission)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
