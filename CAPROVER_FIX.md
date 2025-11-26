# Исправление ошибок deployment на CapRover

## Проблемы в логах:
1. "relation already exists" - таблицы уже созданы
2. "password_hash" column issue - неверное имя колонки
3. Role issues с Neon PostgreSQL

## Решение:

### Шаг 1: Очистить БД на CapRover
В CapRover → mikkeller-db → Execute Command:

```bash
# ВНИМАНИЕ: Это удалит ВСЕ данные!
psql -U $POSTGRES_USER -d $POSTGRES_DB -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

### Шаг 2: Пересоздать миграции
На production сервере, в приложении mikkeller-rc → Execute Command:

```bash
# Создать таблицы заново
npm run db:push -- --force
```

### Шаг 3: Проверить статус
```bash
# Проверить что таблицы созданы
npm run db:push
# Должно быть сообщение что таблицы в порядке
```

### Шаг 4: Создать первого администратора

Создайте Node.js скрипт `/home/runner/workspace/create-admin.js`:

```javascript
import bcrypt from 'bcryptjs';
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createAdmin() {
  try {
    await client.connect();
    
    const password = 'changeme123'; // Измените пароль!
    const hash = await bcrypt.hash(password, 10);
    
    const result = await client.query(
      'INSERT INTO admins (username, password_hash, email, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['admin', hash, 'admin@mikkeller-rc.ru', 'Admin', 'User']
    );
    
    console.log('✅ Admin создан с ID:', result.rows[0].id);
    console.log('Username: admin');
    console.log('Password:', password);
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await client.end();
  }
}

createAdmin();
```

Запустите:
```bash
node create-admin.js
```

## Если还有 ошибки "role does not exist":

Это типично для Neon PostgreSQL. Решение в CapRover:

```bash
# Используйте правильного пользователя
psql -U <ВАШ_POSTGRES_USER> -d <ВАШ_POSTGRES_DB>
```

Вместо `$POSTGRES_USER`, используйте имя пользователя который вы создали (по умолчанию `mikkeller_user`).

---

После выполнения этих шагов приложение должно работать!
