# Исправление БД через SSH на CapRover

## Вариант 1: WebSSH терминал в CapRover (самый простой)

1. **На CapRover главной странице** → пройдите вправо к найденным контейнерам
2. **Нажмите на контейнер mikkeller-db** → должна быть кнопка **"Web Terminal"** или иконка терминала
3. Выполните первую команду:

```bash
psql -U mikkeller_user -d mikkeller_rc << 'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO mikkeller_user;
SQL
```

Затем переключитесь на контейнер **mikkeller-rc** и выполните:

```bash
npm run db:push -- --force
```

Потом:

```bash
node scripts/create-admin.js
```

---

## Вариант 2: SSH с вашего компьютера

### На вашем компьютере (Windows/Mac/Linux):

```bash
# Подключитесь к серверу CapRover
ssh root@your-caprover-domain.ru

# Перейдите в контейнер БД
docker exec -it srv-captain--mikkeller-db bash

# Выполните команды
psql -U mikkeller_user -d mikkeller_rc << 'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO mikkeller_user;
SQL

# Выходите из контейнера (Ctrl+D)
exit

# Перейдите в контейнер приложения
docker exec -it srv-captain--mikkeller-rc bash

# Выполните миграции
npm run db:push -- --force

# Создайте админа
node scripts/create-admin.js

# Выходите
exit
```

---

## Вариант 3: Если SSH не работает

Попробуйте через **CapRover Dashboard**:

1. **Dashboard** → найдите свое приложение **mikkeller-rc**
2. Внизу должен быть раздел **"Container Logs"** или **"App Logs"**
3. Нажмите иконку/кнопку терминала рядом с логами
4. Откроется встроенный терминал - выполните команды там

---

## Что выполнять в каком порядке

### 1️⃣ На контейнере mikkeller-db:

```bash
psql -U mikkeller_user -d mikkeller_rc << 'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO mikkeller_user;
SQL
```

Ожидаемый результат:
```
DROP SCHEMA
CREATE SCHEMA  
GRANT
```

### 2️⃣ На контейнере mikkeller-rc:

```bash
npm run db:push -- --force
```

Ожидаемый результат:
```
✅ Successfully pushed database schema
```

### 3️⃣ На контейнере mikkeller-rc:

```bash
node scripts/create-admin.js
```

Ожидаемый результат:
```
✅ Admin user created successfully!
Username: admin
Password: changeme123
```

### 4️⃣ Перезагрузите приложение

В CapRover Dashboard нажмите **Restart** для приложения mikkeller-rc.

---

## Если ничего не работает

**Проверьте какие контейнеры запущены:**

```bash
docker ps | grep mikkeller
```

Должны быть оба:
- `srv-captain--mikkeller-db` (база данных)
- `srv-captain--mikkeller-rc` (приложение)

Если контейнер не запущен - перезагрузите приложение в CapRover Dashboard.

---

## Имена контейнеров

В зависимости от версии CapRover имена могут быть:
- `srv-captain--mikkeller-db` или просто `mikkeller-db`
- `srv-captain--mikkeller-rc` или просто `mikkeller-rc`

Проверьте реальные имена командой `docker ps`.

---

**Какой вариант у вас есть в CapRover?**
1. WebSSH терминал прямо в интерфейсе
2. SSH доступ к серверу
3. Встроенный терминал в логах

Дайте знать какой вариант работает, и я подробнее объясню! 🚀
