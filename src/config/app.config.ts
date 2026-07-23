import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const appSchema = z.object({
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().int().positive().max(65535).default(3000),
  serviceName: z.string().default('unknown'),
});

export default registerAs('app', () => appSchema.parse({
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  serviceName: process.env.SERVICE_NAME,
}));
