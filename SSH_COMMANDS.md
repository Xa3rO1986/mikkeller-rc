# SSH команды для исправления БД на CapRover

Выполняйте эти команды на вашем CapRover сервере через SSH поочередно.

## Шаг 1: Найти контейнеры

```bash
/usr/bin/docker ps -a
```

ИЛИ попробуйте:

```bash
docker ps -a
sudo docker ps -a
```

**Найдите строки с именами похожими на:**
- `mikkeller-db`
- `mikkeller-rc`
- `postgres`
- `node`

Скопируйте полные имена контейнеров и замените в следующих шагах.

---

## Шаг 2: Очистить БД

**Замените `CONTAINER_NAME` на реальное имя контейнера с БД (из Шага 1):**

```bash
/usr/bin/docker exec -it CONTAINER_NAME bash
```

Внутри контейнера:

```bash
psql -U mikkeller_user -d mikkeller_rc << 'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO mikkeller_user;
SQL
```

Выход из контейнера:
```bash
exit
```

---

## Шаг 3: Создать таблицы

**Замените `APP_CONTAINER` на реальное имя контейнера приложения:**

```bash
/usr/bin/docker exec -it APP_CONTAINER bash
```

Внутри контейнера (в /app директории):

```bash
npm run db:push -- --force
```

Ждите пока выведет успех.

---

## Шаг 4: Создать админа

В том же контейнере:

```bash
node scripts/create-admin.js
```

Сохраните выданные credentials.

---

## Шаг 5: Выход и перезагрузка

Выход из контейнера:
```bash
exit
```

Перезагрузить приложение:
```bash
/usr/bin/docker restart APP_CONTAINER
```

---

## Если команда docker не найдена

Попробуйте:

```bash
which docker
whereis docker
find /usr -name docker 2>/dev/null
```

Или запустите одну из этих:
```bash
/usr/bin/docker ps -a
/snap/bin/docker ps -a
snap run docker ps -a
```

---

## Пример полных команд (если контейнеры называются так):

```bash
# Проверить контейнеры
/usr/bin/docker ps -a

# Очистить БД (если контейнер называется mikkeller-db)
/usr/bin/docker exec -it mikkeller-db bash
# Внутри: psql -U mikkeller_user -d mikkeller_rc << 'SQL'
# DROP SCHEMA IF EXISTS public CASCADE;
# CREATE SCHEMA public;
# SQL
# exit

# Создать таблицы (если контейнер приложения называется mikkeller-rc)
/usr/bin/docker exec -it mikkeller-rc bash
# Внутри: npm run db:push -- --force
# node scripts/create-admin.js
# exit

# Перезагрузить
/usr/bin/docker restart mikkeller-rc
```

---

**Выполните Шаг 1 и дайте мне вывод - скажу точные команды для вашего сервера!**
