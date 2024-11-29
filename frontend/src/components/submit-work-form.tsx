"use client";

import { useAuth } from "@/contexts/auth-context";
import { User } from "@/types/user";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileUpload } from "./file-upload";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface SubmitWorkFormProps {
  onSubmissionCreated?: () => void;
}

export function SubmitWorkForm({ onSubmissionCreated }: SubmitWorkFormProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [professors, setProfessors] = useState<User[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState("");

  useEffect(() => {
    // Carregar lista de professores
    fetch(`${API_URL}/api/users?role=TEACHER`)
      .then((res) => res.json())
      .then((data) => {
        console.log("[SubmitWorkForm] Professores carregados:", data);
        setProfessors(data);
      })
      .catch((error) => console.error("Erro ao carregar professores:", error));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Por favor, selecione um arquivo");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("studentId", user!.id);
      formData.append("professorId", selectedProfessor);
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/submissions`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar trabalho");
      }

      toast.success("Trabalho enviado com sucesso!");
      setTitle("");
      setDescription("");
      setFile(null);
      setSelectedProfessor("");
      onSubmissionCreated?.();
    } catch (error) {
      console.error("Erro ao enviar trabalho:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar trabalho"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Título do Trabalho</Label>
          <Input
            id="title"
            placeholder="Ex: Trabalho de Matemática - Capítulo 3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Descreva brevemente o seu trabalho..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-[100px]"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="professor">Professor</Label>
          <Select
            value={selectedProfessor}
            onValueChange={setSelectedProfessor}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um professor" />
            </SelectTrigger>
            <SelectContent>
              {professors.map((professor) => (
                <SelectItem key={professor.id} value={professor.id}>
                  {professor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="file">Arquivo</Label>
          <FileUpload onChange={setFile} value={file} required />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        <Upload className="mr-2 h-4 w-4" />
        {isSubmitting ? "Enviando..." : "Enviar Trabalho"}
      </Button>
    </form>
  );
}
