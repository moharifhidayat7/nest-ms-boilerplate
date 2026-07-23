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
│   │   └── prisma.service.ts
│   └── graphql/
│       └── graphql.module.ts  ← Apollo driver config
│
├── common/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.guard.ts          ← base guard
│   │   ├── internal.guard.ts      ← validates internal JWT
│   │   ├── external.guard.ts      ← calls Auth Service
│   │   ├── current-user.decorator.ts
│   │   ├── internal-token.service.ts  ← generates outgoing JWTs
│   │   ├── token-validator.ts     ← abstract class + JwtPayload type
│   │   └── strategies/
│   │       ├── internal-jwt.validator.ts
│   │       └── remote-auth.validator.ts
│   ├── config/
│   │   └── env.config.ts
│   ├── decorators/
│   │   └── skip-response-wrap.decorator.ts
│   ├── filters/
│   │   └── global-exception.filter.ts
│   ├── interceptors/
│   │   ├── logging.interceptor.ts
│   │   └── response.interceptor.ts
│   └── pagination/
│       ├── pagination.dto.ts
│       └── pagination.interface.ts
│
├── modules/
│   ├── empty/
│   └── health/
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
cp .env.example .env
```

## Running

```bash
pnpm start:dev      # development
pnpm start:prod     # production
```

## Tests

```bash
pnpm test          # unit (Jest)
pnpm test:e2e      # e2e (supertest)
```

## Environment

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | yes | — | PostgreSQL connection string |
| `INTERNAL_JWT_SECRET` | yes | — | Shared secret for signing/verifying internal JWTs |
| `AUTH_SERVICE_URL` | yes | — | Auth service base URL |
| `SERVICE_NAME` | no | `unknown` | Identity used when generating internal tokens |
| `PORT` | no | `3000` | HTTP port |
| `NODE_ENV` | no | `development` | `development`, `production`, `test` |

## Auth

Two guards available per endpoint:

| Guard | Validator | Use case |
|---|---|---|
| `ExternalAuthGuard` | `RemoteAuthValidator` — calls Auth Service `POST /auth/validate-token` | Client-facing |
| `InternalAuthGuard` | `InternalJwtValidator` — verifies short-lived JWT with shared secret | Service-to-service |

### Client-facing

```ts
@UseGuards(ExternalAuthGuard)
@Get('users')
getUsers() { ... }
```

### Service-to-service

Service A generates a fresh JWT (5 min expiry), Service B verifies it.

**Service A — sending the request:**

```ts
import { InternalTokenService } from './common/auth/internal-token.service';

@Injectable()
export class NotificationClient {
  constructor(private readonly tokenService: InternalTokenService) {}

  async notify(userId: string) {
    const token = this.tokenService.generate();
    await fetch('http://notification-service/internal/send', {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
```

**Service B — receiving the request:**

```ts
@UseGuards(InternalAuthGuard)
@Post('internal/send')
async send(@Body() body: SendDto, @CurrentUser() user: JwtPayload) {
  console.log(user.sub); // 'schedule-service' — identifies the caller
}
```

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
# Rename files Empty → Order
# Add use-cases, inject guards, register in AppModule
```
