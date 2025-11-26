# Деплой с архивов

## 📦 Архивы для скачивания

1. **mikkeller-database.tar.gz** (11 KB) - Backup базы данных
2. **mikkeller-app.tar.gz** (43 MB) - Исходный код приложения

## Инструкция по развертыванию на CapRover

### Шаг 1: Подготовка сервера

На вашем CapRover создайте две приложения:
- **mikkeller-db** - контейнер PostgreSQL
- **mikkeller-rc** - контейнер приложение

### Шаг 2: Восстановление БД

```bash
# На сервере CapRover, в контейнере mikkeller-db

# Загрузите mikkeller-database.tar.gz и распакуйте
cd /tmp
tar -xzf mikkeller-database.tar.gz

# Восстановите БД
psql -U mikkeller_user -d mikkeller_rc < database.sql
```

### Шаг 3: Развертывание приложения

```bash
# На сервере CapRover, в контейнере mikkeller-rc
cd /app

# Загрузите mikkeller-app.tar.gz и распакуйте
tar -xzf mikkeller-app.tar.gz

# Установите зависимости
npm install --production

# Создайте таблицы
npm run db:push -- --force

# Создайте админа
node scripts/create-admin.js

# Запустите приложение (обычно CapRover делает это автоматически)
npm start
```

### Шаг 4: Переменные окружения

В CapRover → App Configs установите следующие переменные для **mikkeller-rc**:

```env
NODE_ENV=production
DATABASE_URL=postgresql://mikkeller_user:YOUR_PASSWORD@mikkeller-db:5432/mikkeller_rc
SESSION_SECRET=your-random-secret-key-min-32-chars
VITE_YANDEX_MAPS_API_KEY=your-yandex-maps-key
YOOKASSA_SHOP_ID=your-shop-id
YOOKASSA_SECRET_KEY=your-secret-key
STRAVA_CLIENT_ID=your-client-id
STRAVA_CLIENT_SECRET=your-client-secret
STRAVA_REDIRECT_URI=https://your-domain.ru/api/strava/callback
```

Для **mikkeller-db** (PostgreSQL контейнер):

```env
POSTGRES_USER=mikkeller_user
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=mikkeller_rc
```

### Шаг 5: Настройка Persistent Directories

В CapRover → App Settings → Persistent Directories для **mikkeller-rc**:

```
/app/server/uploads
```

Это сохранит загруженные фотографии, обложки событий и GPX файлы при перезагрузке.

### Шаг 6: SSL и Domain

В CapRover → App Settings установите:
- **Domain**: `your-domain.ru` или `www.your-domain.ru`
- **HTTPS**: Включить (автоматический Let's Encrypt)
- **Force HTTPS**: Включить

## Проверка после деплоя

1. Откройте приложение в браузере: `https://your-domain.ru`
2. Проверьте что фронтенд загружается
3. Перейдите в `/admin`
4. Логинитесь с credentials выданными `node scripts/create-admin.js`
5. Проверьте что все функции работают:
   - Загрузка фотографий
   - Создание событий
   - Магазин
   - Рейтинг Strava

## Если что-то не работает

### 1. Приложение не запускается

```bash
# Проверьте логи
# CapRover → Apps → mikkeller-rc → App Logs

# Попробуйте пересоздать таблицы
npm run db:push -- --force

# Проверьте что DATABASE_URL правильный
echo $DATABASE_URL
```

### 2. "relation does not exist" ошибка

```bash
# Синхронизируйте схему БД
npm run db:push -- --force
```

### 3. Не удается создать админа

```bash
# Убедитесь что таблицы созданы
psql $DATABASE_URL -c "SELECT * FROM admins;"

# Создайте админа заново
node scripts/create-admin.js
```

### 4. Фотографии/загрузки теряются после перезагрузки

Убедитесь что вы настроили **Persistent Directories** для `/app/server/uploads`

## Размеры архивов

- Database: 11 KB
- Application: 43 MB
- **Total: ~43 MB**

## Структура проекта в архиве

```
mikkeller-app/
├── client/                  # React фронтенд
├── server/                  # Express бэкенд
├── shared/                  # Общие типы и схемы
├── migrations/              # Drizzle миграции
├── scripts/                 # Вспомогательные скрипты
├── package.json
├── drizzle.config.ts
└── ...
```

## Дополнительные команды

```bash
# Просмотр логов БД
docker logs mikkeller-db

# Просмотр логов приложения
docker logs mikkeller-rc

# Backup БД
pg_dump $DATABASE_URL > backup.sql

# Восстановление БД
psql $DATABASE_URL < backup.sql

# Просмотр статуса миграций
npm run db:introspect
```

## Дополнительная поддержка

Все необходимые конфигурации находятся в:
- `.env.example` - пример переменных окружения
- `DEPLOYMENT.md` - подробная инструкция CapRover
- `PRODUCTION_CHECKLIST.md` - контрольный список перед запуском
- `scripts/pre-deploy-check.js` - автоматическая проверка готовности

---

**Готово! Оба архива скачиваются из вашего Replit проекта. Следуйте шагам выше для развертывания.** 🚀
