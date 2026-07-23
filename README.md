# Schedule Service

NestJS microservice boilerplate with GraphQL + REST, Prisma ORM, and pluggable auth.

## Structure

```
src/
├── app.module.ts              ← root module
├── main.ts                    ← bootstrap with CORS, ValidationPipe, shutdown hooks
│
├── integrations/
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   ├── prisma.service.ts  ← extends PrismaClient, wired to ConfigService
│   └── graphql/
│       └── graphql.module.ts  ← Apollo driver config
│
├── common/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.guard.ts          ← base guard class
│   │   ├── internal.guard.ts      ← validates internal JWT directly
│   │   ├── external.guard.ts      ← calls Auth Service for validation
│   │   ├── current-user.decorator.ts ← @CurrentUser() param decorator
│   │   ├── token-validator.ts     ← abstract class + JwtPayload type
│   │   └── strategies/
│   │       ├── internal-jwt.validator.ts
│   │       └── remote-auth.validator.ts
│   ├── config/
│   │   └── env.config.ts          ← Joi validation schema for all env vars
│   ├── decorators/
│   │   └── skip-response-wrap.decorator.ts
│   ├── filters/
│   │   └── global-exception.filter.ts  ← consistent error envelope
│   ├── interceptors/
│   │   ├── logging.interceptor.ts   ← request log
│   │   └── response.interceptor.ts  ← wraps responses in { statusCode, message, data, meta }
│   └── pagination/
│       ├── pagination.dto.ts
│       └── pagination.interface.ts
│
├── modules/
│   ├── empty/                    ← template module, copy to create new ones
│   └── health/
│       ├── health.module.ts
│       └── health.controller.ts  ← GET /health (prisma ping)
│
└── prisma/
    ├── schema.prisma
    └── seed/
        └── index.ts
```

## Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL (or Prisma Postgres)

## Setup

```bash
pnpm install
pnpm prisma generate
cp .env.example .env          # or edit existing .env
```

## Running

```bash
# development
pnpm start:dev

# production
pnpm start:prod
```

## Tests

```bash
pnpm test          # unit (Jest)
pnpm test:e2e      # e2e (supertest)
```

## Auth

Two guards available per endpoint:

| Guard | Validator | Use case |
|---|---|---|
| `ExternalAuthGuard` | `RemoteAuthValidator` → calls Auth Service `POST /auth/validate-token` | Client-facing endpoints |
| `InternalAuthGuard` | `InternalJwtValidator` → verifies JWT with shared secret | Service-to-service |

```ts
@UseGuards(ExternalAuthGuard)
@Get('users')
getUsers() { ... }

@UseGuards(InternalAuthGuard)
@Get('internal/data')
getInternalData() { ... }
```

## Environment

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | yes | — | PostgreSQL connection string |
| `INTERNAL_JWT_SECRET` | yes | — | Secret for service-to-service JWT |
| `AUTH_SERVICE_URL` | yes | — | Auth service base URL |
| `PORT` | no | `3000` | HTTP port |
| `NODE_ENV` | no | `development` | `development`, `production`, `test` |

## API

### REST

```
GET    /health              ← health check (prisma ping)
GET    /web/empty           ← template endpoints
POST   /web/empty
PATCH  /web/empty/:id
DELETE /web/empty/:id
```

All responses wrapped in:
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": { ... },
  "meta": { "timestamp": "..." }
}
```

### GraphQL

```
POST /graphql
```

## Docker

```bash
docker build -t schedule-service .
docker run -p 3000:3000 --env-file .env schedule-service
```

## Creating a new module

```bash
cp -r src/modules/empty src/modules/orders
# Rename files and class names Empty → Order
# Add use-cases, inject guards, register in AppModule
```
