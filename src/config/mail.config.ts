import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const mailSchema = z.object({
  host: z.string(),
  port: z.coerce.number().int().positive().max(65535).default(587),
  user: z.string().optional(),
  password: z.string().optional(),
  from: z.string().default('noreply@example.com'),
  templateDir: z.string().default('./templates/mail'),
});

export default registerAs('mail', () => mailSchema.parse({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASSWORD,
  from: process.env.MAIL_FROM,
  templateDir: process.env.MAIL_TEMPLATE_DIR,
}));
