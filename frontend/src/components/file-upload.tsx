"use client";

import { UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";

interface FileUploadProps {
  onChange: (file: File | null) => void;
  value: File | null;
  required?: boolean;
}

export function FileUpload({ onChange, value, required }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ];
        if (!allowedTypes.includes(file.type)) {
          setError("Tipo de arquivo não suportado. Use PDF, DOC ou DOCX");
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          setError("Arquivo muito grande. Tamanho máximo: 10MB");
          return;
        }
        onChange(file);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
  });

  const removeFile = () => {
    onChange(null);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors
          ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary"
          }
          ${error ? "border-red-500" : ""}
        `}
      >
        <input {...getInputProps()} required={required} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-sm">Solte o arquivo aqui...</p>
          ) : (
            <>
              <p className="text-sm">
                Arraste e solte um arquivo aqui, ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground">
                Arquivos suportados: PDF, DOC, DOCX
              </p>
            </>
          )}
        </div>
      </div>

      {value && (
        <div className="mt-4 p-4 bg-muted rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <div>
              <p className="font-medium">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {(value.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
