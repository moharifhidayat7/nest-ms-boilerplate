import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TokenValidator, JwtPayload } from '../token-validator';

@Injectable()
export class RemoteAuthValidator extends TokenValidator {
  private readonly url: string;
  private readonly timeoutMs: number;

  constructor(config: ConfigService) {
    super();
    this.url = config.get<string>('AUTH_SERVICE_URL', 'http://localhost:4000');
    this.timeoutMs = 2000;
  }

  async validate(token: string): Promise<JwtPayload> {
    const { data } = await axios.post<JwtPayload>(
      `${this.url}/auth/validate-token`,
      { token },
      { timeout: this.timeoutMs },
    );
    return data;
  }
}
