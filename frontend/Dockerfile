# --- Stage 1: Builder ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY . .
RUN npm run build

# --- Stage 2: Production ---
FROM node:18-alpine AS production

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
