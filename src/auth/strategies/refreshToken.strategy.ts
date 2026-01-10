import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) throw new InternalServerErrorException();
    super({
      jwtFromRequest: (req: Request) => {
        const cookieName =
          configService.get<string>('REFRESH_TOKEN_COOKIE_NAME') ??
          'refresh_token';
        return req?.cookies?.[cookieName] ?? null;
      },
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    // refresh token уже извлечен зайдет через jwtFromRequest; но если нужно — прочитаем тоже:
    const cookieName =
      this.configService.get<string>('REFRESH_TOKEN_COOKIE_NAME') ??
      'refresh_token';
    const refreshToken = req?.cookies?.[cookieName];
    return { ...payload, refreshToken };
  }
}
