"use client";

import { useAuth } from "@/hooks/useAuth";
import { Submission } from "@/types/submission";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  CheckCircle,
  Clock,
  Download,
  FileText,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { EvaluateSubmissionDialog } from "./evaluate-submission-dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const statusLabels = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
} as const;

export function ProfessorSubmissionsList() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("User data:", user);

    if (user?.id) {
      console.log("Fetching submissions for professor:", user.id);
      fetch(`http://localhost:3000/api/submissions?professorId=${user.id}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          console.log("Response status:", res.status);
          if (!res.ok) {
            const text = await res.text();
            console.error("Error response:", text);
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Submissions data:", data);
          setSubmissions(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching submissions:", error);
          setLoading(false);
        });
    }
  }, [user?.id]);

  const filteredSubmissions = submissions.filter((submission) =>
    submission.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    PENDING: "bg-yellow-500/20 text-yellow-600",
    APPROVED: "bg-green-500/20 text-green-600",
    REJECTED: "bg-red-500/20 text-red-600",
  };

  const statusIcons = {
    PENDING: <Clock className="h-4 w-4" />,
    APPROVED: <CheckCircle className="h-4 w-4" />,
    REJECTED: <XCircle className="h-4 w-4" />,
  };

  const handleEvaluate = async (submission: Submission) => {
    const response = await fetch(
      `http://localhost:3000/api/submissions/${submission.id}/status`,
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      }
    );

    if (response.ok) {
      const updatedResponse = await fetch(
        `http://localhost:3000/api/submissions?professorId=${user?.id}`,
        {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const updatedData = await updatedResponse.json();
      setSubmissions(updatedData);
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar trabalhos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Aluno</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviado</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : filteredSubmissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhum trabalho encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {submission.title}
                      </div>
                    </TableCell>
                    <TableCell>{submission.student?.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`flex w-fit items-center gap-1 ${
                          statusColors[submission.status]
                        }`}
                      >
                        {statusIcons[submission.status]}
                        {statusLabels[submission.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          {formatDistanceToNow(
                            new Date(submission.submittedAt),
                            {
                              addSuffix: true,
                              locale: ptBR,
                            }
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {new Date(submission.submittedAt).toLocaleString(
                            "pt-BR"
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {submission.grade !== null
                        ? `${submission.grade}/100`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(submission.file.url)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Baixar trabalho</TooltipContent>
                        </Tooltip>

                        <EvaluateSubmissionDialog
                          submission={submission}
                          onEvaluated={() => handleEvaluate(submission)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}
