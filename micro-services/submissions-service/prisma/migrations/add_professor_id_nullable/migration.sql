-- Primeiro adicionar a coluna como nullable
ALTER TABLE "Submission" ADD COLUMN "professorId" TEXT;

-- Criar o índice
CREATE INDEX "Submission_professorId_idx" ON "Submission"("professorId"); 