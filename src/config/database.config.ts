import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const databaseSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().int().positive().max(65535).default(5432),
  user: z.string().default('postgres'),
  password: z.string().default('postgres'),
  dbName: z.string().default('auth_service'),
});

export default registerAs('database', () => {
  const vars = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
  };
  const parsed = databaseSchema.parse(vars);
  const url = `postgres://${parsed.user}:${parsed.password}@${parsed.host}:${parsed.port}/${parsed.dbName}`;
  return { ...parsed, url };
});
