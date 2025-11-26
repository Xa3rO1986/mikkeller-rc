# ⚠️ CapRover Database Fix

Таблицы БД не созданы. Следуйте этим шагам точно в порядке:

## Шаг 1: Очистить БД (в контейнере mikkeller-db)

**На CapRover → Apps → mikkeller-db → Execute Command:**

```bash
psql -U mikkeller_user -d mikkeller_rc << 'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO mikkeller_user;
SQL
```

Должно вывести:
```
DROP SCHEMA
CREATE SCHEMA
GRANT
```

## Шаг 2: Создать таблицы (в контейнере mikkeller-rc)

**На CapRover → Apps → mikkeller-rc → Execute Command:**

```bash
npm run db:push -- --force
```

Это создаст все таблицы:
- page_settings ✅
- events ✅
- locations ✅
- photos ✅
- products ✅
- orders ✅
- admins ✅
- и другие...

**Ждите пока выведет:**
```
✅ Successfully pushed database schema
```

## Шаг 3: Создать первого администратора

**На CapRover → Apps → mikkeller-rc → Execute Command:**

```bash
node scripts/create-admin.js
```

Должно вывести:
```
✅ Admin user created successfully!
Username: admin
Password: changeme123
```

Сохраните эти credentials для входа в админ-панель.

## Шаг 4: Перезагрузить приложение

**На CapRover → Apps → mikkeller-rc → Restart**

Нажмите кнопку Restart.

## Шаг 5: Проверить работоспособность

1. Откройте `https://your-domain.ru` в браузере
2. Должна загрузиться главная страница
3. Перейдите на `https://your-domain.ru/admin`
4. Логинитесь:
   - Username: `admin`
   - Password: `changeme123`

Если админ-панель загрузилась - всё работает! ✅

## Если остались ошибки

### Ошибка: "relation page_settings does not exist"

Повторите Шаг 1 и Шаг 2:
```bash
# На mikkeller-db
psql -U mikkeller_user -d mikkeller_rc -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# На mikkeller-rc  
npm run db:push -- --force
```

### Ошибка: "npm: command not found"

Контейнер не имеет Node.js. Нужно пересоздать контейнер mikkeller-rc с правильным базовым образом (node:20-alpine или похожий).

### Ошибка: "Database connection failed"

Проверьте переменную окружения `DATABASE_URL`:
```bash
echo $DATABASE_URL
```

Должна быть формата:
```
postgresql://mikkeller_user:PASSWORD@mikkeller-db:5432/mikkeller_rc
```

### Ошибка при создании админа

Убедитесь что таблица admins создана:
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM admins;"
```

Если ошибка - повторите Шаг 2.

---

## 🚀 После исправления

Приложение должно полностью работать:
- ✅ Главная страница
- ✅ События и локации
- ✅ Админ-панель
- ✅ Загрузка фотографий
- ✅ Магазин
- ✅ Рейтинг бегунов

Если что-то не работает - проверьте логи CapRover (App Logs) на наличие новых ошибок.

---

## Полезные команды для отладки

```bash
# Проверить что таблицы существуют
psql $DATABASE_URL -c "SELECT tablename FROM pg_tables WHERE schemaname='public';"

# Посмотреть структуру таблицы
psql $DATABASE_URL -c "\d page_settings"

# Посмотреть логи приложения
docker logs mikkeller-rc

# Посмотреть логи БД
docker logs mikkeller-db
```

---

**Следуйте шагам выше точно в порядке. Если остались вопросы - проверьте логи CapRover.**
