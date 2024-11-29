FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Gerar o cliente Prisma antes do build
RUN npx prisma generate

RUN npm run build

COPY scripts/start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"] 