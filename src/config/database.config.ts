import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const databaseSchema = z.object({
  url: z.url(),
});

export default registerAs('database', () => databaseSchema.parse({
  url: process.env.DATABASE_URL,
}));
