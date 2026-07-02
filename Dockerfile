FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# /data — точка монтирования Railway Volume для SQLite
RUN mkdir -p /data

EXPOSE 3000

ENV DB_PATH=/data/kitchen.db

CMD ["node", "server.js"]
