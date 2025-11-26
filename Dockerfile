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
# Frontend build
RUN npx vite build
# Backend build с явным исключением dev-only пакетов
RUN npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --external:vite --external:@vitejs/* --external:@replit/* --external:tsx --external:drizzle-kit --outdir=dist
# Компилируем server/static.ts для production
RUN npx esbuild server/static.ts --platform=node --format=esm --outfile=dist/static.js

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
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/drizzle.config.js ./drizzle.config.js
COPY --from=builder /app/migrations ./migrations

# Создаем директории для загрузок
RUN mkdir -p server/uploads/photos server/uploads/covers server/uploads/gpx

# Порт приложения
EXPOSE 5000

# Запуск приложения
CMD ["node", "dist/index.js"]
