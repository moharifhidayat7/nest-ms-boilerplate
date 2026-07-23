import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InternalJwtValidator } from './strategies/internal-jwt.validator';
import { RemoteAuthValidator } from './strategies/remote-auth.validator';
import { InternalAuthGuard } from './internal.guard';
import { ExternalAuthGuard } from './external.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('INTERNAL_JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    InternalJwtValidator,
    RemoteAuthValidator,
    InternalAuthGuard,
    ExternalAuthGuard,
  ],
  exports: [InternalAuthGuard, ExternalAuthGuard],
})
export class AuthModule {}
