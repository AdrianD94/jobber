import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokekenPayload } from '../token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => request?.cookies?.Authentication || request.token,
      ]),
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: TokekenPayload) {
    return payload;
  }
}
