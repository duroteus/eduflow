FROM node:18-alpine

WORKDIR /app

# Instalar netcat
RUN apk add --no-cache netcat-openbsd

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npm install -g prisma

COPY . .

RUN npm run build

EXPOSE 3001

COPY scripts/init.sh /init.sh
RUN chmod +x /init.sh

CMD ["/init.sh"] 