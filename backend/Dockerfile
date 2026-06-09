# Stage 1: Builder — install all dependencies and prepare source
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Stage 2: Production — copy only what's needed to run
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/server.js ./

EXPOSE 8080

CMD ["node", "server.js"]
