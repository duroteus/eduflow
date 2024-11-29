#!/bin/sh

# Espera o banco de dados estar pronto
echo "Waiting for database..."
until nc -z submissions-db 5432; do
  sleep 1
done
echo "Database is ready!"

# Executa as migrações do Prisma
npx prisma migrate deploy

# Inicia a aplicação
npm start 