import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const authSchema = z.object({
  internalJwtSecret: z.string().min(8),
  authServiceUrl: z.url(),
});

export default registerAs('auth', () => authSchema.parse({
  internalJwtSecret: process.env.INTERNAL_JWT_SECRET,
  authServiceUrl: process.env.AUTH_SERVICE_URL,
}));
