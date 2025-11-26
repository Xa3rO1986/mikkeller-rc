#!/bin/bash

echo "🔍 Ищу Docker на сервере..."
echo ""

# Try different paths
DOCKER_PATHS=(
  "/usr/bin/docker"
  "/usr/local/bin/docker"
  "$(which docker 2>/dev/null)"
  "$(sudo which docker 2>/dev/null)"
)

DOCKER_CMD=""

for path in "${DOCKER_PATHS[@]}"; do
  if [ -x "$path" ] 2>/dev/null; then
    DOCKER_CMD="$path"
    echo "✅ Найден Docker: $DOCKER_CMD"
    break
  fi
done

if [ -z "$DOCKER_CMD" ]; then
  echo "❌ Docker не найден!"
  echo ""
  echo "Попробуйте установить Docker:"
  echo "  sudo apt-get update"
  echo "  sudo apt-get install docker.io"
  echo ""
  echo "Или проверьте установку CapRover."
  exit 1
fi

echo ""
echo "📦 Контейнеры на сервере:"
$DOCKER_CMD ps -a | grep -E "mikkeller|postgres|node" || echo "Контейнеры не найдены"

echo ""
echo "Для исправления БД используйте:"
echo ""
echo "$DOCKER_CMD exec -it CONTAINER_NAME bash"
echo ""
echo "где CONTAINER_NAME - имя контейнера из списка выше"
