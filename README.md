# readright

### Сборка

**docker compose up -d** - Для разработки

**docker compose -f docker-compose.yml up** - Для прода

**docker run -d --name redis-server --network readright-network -p 6379:6379 redis:8.2.1-alpine3.22** - Поднять Redis для локальной разработки
