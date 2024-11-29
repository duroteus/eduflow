-- Atualizar registros existentes (substitua SOME_DEFAULT_ID pelo ID de um professor real)
UPDATE "Submission" SET "professorId" = 'SOME_DEFAULT_ID' WHERE "professorId" IS NULL;

-- Tornar a coluna NOT NULL
ALTER TABLE "Submission" ALTER COLUMN "professorId" SET NOT NULL; 