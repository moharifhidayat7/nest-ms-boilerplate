import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const redisSchema = z.object({
  host: z.string(),
  port: z.coerce.number().int().positive().max(65535).default(6379),
  password: z.string().optional(),
  db: z.coerce.number().int().min(0).default(0),
});

export default registerAs('redis', () => redisSchema.parse({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB,
}));
