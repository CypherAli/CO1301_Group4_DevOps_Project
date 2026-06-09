# ===========================================
# STUDENT TODO: Create Frontend Dockerfile
# ===========================================
#
# Requirements:
# 1. Must use multi-stage build
# 2. Stage 1 (builder):
#    - Use node:18-alpine
#    - Install dependencies with npm ci
#    - Build the React app with npm run build
#
# 3. Stage 2 (production):
#    - Use node:18-alpine
#    - Install 'serve' package globally to serve static files
#    - Copy only the build folder from builder stage
#    - Expose port 3000
#    - Use serve to run the app
#
# Hints:
# - npm run build creates a 'build' folder
# - serve -s build -l 3000 serves the static files
# - Research: "Docker multi-stage React production"
# ===========================================

# YOUR CODE HERE:
# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files và cài đặt dependencies
COPY package*.json ./
RUN npm ci

# Set ARG for API URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy toàn bộ code và build ứng dụng
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Cài đặt thư viện 'serve' để chạy static files
RUN npm install -g serve

# Copy folder 'build' từ builder stage sang
COPY --from=builder /app/build ./build

# Expose port 3000
EXPOSE 3000

# Chạy ứng dụng bằng serve
CMD ["serve", "-s", "build", "-l", "3000"]

# Chỉ copy thư mục 'build' từ Stage 1 sang
COPY --from=builder /app/build ./build

# Mở port 3000
EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
EXPOSE 3000

# Chạy ứng dụng bằng serve
CMD ["serve", "-s", "build", "-l", "3000"]
EXPOSE 3000

# Chạy ứng dụng bằng serve
CMD ["serve", "-s", "build", "-l", "3000"]
