FROM node:18-bullseye-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
  netcat \
  python3 \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

# Limpar cache do npm e instalar dependências
RUN npm cache clean --force
RUN npm install
RUN npm rebuild argon2 --build-from-source
RUN npm install -g prisma

COPY . .

RUN npm run build

EXPOSE 3002

COPY scripts/init.sh /init.sh
RUN chmod +x /init.sh

CMD ["/init.sh"] 