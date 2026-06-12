# --- Stage 1: Builder ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# --- Stage 2: Production ---
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
# Cài đặt tất cả dependencies (bao gồm devDependencies) để có thể chạy test trong container
RUN npm install

COPY --from=builder /app/server.js ./
COPY --from=builder /app/jest.config.js ./
COPY --from=builder /app/tests ./tests

EXPOSE 8080

CMD ["node", "server.js"]
