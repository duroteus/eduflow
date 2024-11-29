#!/bin/sh

echo "Running migrations..."
npx prisma migrate deploy

echo "Starting service..."
npm start 