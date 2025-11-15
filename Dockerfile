# Mikkeller Running Club - Production Dockerfile для CapRover

# Stage 1: Build
FROM node:20-slim AS builder

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Установка ВСЕХ зависимостей (включая devDependencies для сборки)
RUN npm ci

# Копируем весь проект
COPY . .

# Собираем приложение (требует devDependencies: vite, esbuild, etc.)
RUN npm run build

# Stage 2: Production
FROM node:20-slim

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Установка только production зависимостей
RUN npm ci --only=production && npm cache clean --force

# Копируем собранное приложение из builder stage
COPY --from=builder /app/dist ./dist

# Копируем необходимые runtime файлы
COPY --from=builder /app/shared ./shared

# Создаем директории для загрузок
RUN mkdir -p server/uploads/photos server/uploads/covers server/uploads/gpx

# Порт приложения
EXPOSE 5000

# Запуск приложения
CMD ["node", "dist/index.js"]
