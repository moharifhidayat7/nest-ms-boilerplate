import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '../../integrations/prisma/prisma.module';
import { RedisModule } from '../../integrations/redis/redis.module';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, PrismaModule, RedisModule],
  controllers: [HealthController],
})
export class HealthModule {}
