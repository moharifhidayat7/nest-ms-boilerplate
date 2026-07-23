import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class InternalTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generate(): string {
    return this.jwtService.sign({
      sub: process.env.SERVICE_NAME ?? 'unknown',
      roles: ['internal'],
    });
  }
}
