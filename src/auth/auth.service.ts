import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as ms from 'ms';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { TokensService } from 'src/tokens/tokens.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly tokensService: TokensService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
    meta?: { ip?: string; userAgent?: string },
  ): Promise<any> {
    const userExists = await this.usersService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const hashPassword = await this.bcryptService.hash(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashPassword,
    });
    const { accessToken, refreshToken } = await this.tokensService.getTokens(
      newUser.id,
      newUser.email,
      [newUser.userType],
    );

    const refreshExpStr = this.configService.get<string>(
      'JWT_REFRESH_SECRET_EXP',
    ) as ms.StringValue;
    const expMs = ms(refreshExpStr);
    const expiresAt = new Date(Date.now() + expMs);

    await this.refreshTokenService.create(
      refreshToken,
      newUser.id,
      expiresAt,
      meta,
    );

    const maxSessions = Number(
      this.configService.get<number>('REFRESH_TOKEN_MAX_SESSIONS') ?? 5,
    );

    await this.refreshTokenService.enforceMaxSessions(newUser.id, maxSessions);
    return { accessToken, refreshToken, newUser };
  }

  // SignIn: создаём access + refresh, сохраняем refresh (хеш) и возвращаем access + refresh (или помещаем в cookie)
  async signIn(
    email: string,
    password: string,
    meta?: { ip?: string; userAgent?: string },
  ) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await this.bcryptService.compare(password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = await this.tokensService.getTokens(
      user.id,
      user.email,
      [user.userType],
    );

    // compute expiresAt for refresh token
    const expiresAt = this.getRefreshTokenExpiry();

    // create hashed refresh token record
    await this.refreshTokenService.create(
      refreshToken,
      user.id,
      expiresAt,
      meta,
    );

    // enforce max sessions if configured
    const maxSessions = Number(
      this.configService.get<number>('REFRESH_TOKEN_MAX_SESSIONS') ?? 5,
    );
    await this.refreshTokenService.enforceMaxSessions(user.id, maxSessions);

    return { accessToken, refreshToken, user };
  }

  private getRefreshTokenExpiry(): Date {
    const refreshExpStr = this.configService.get<string>(
      'JWT_REFRESH_SECRET_EXP',
    );
    const expMs = ms(refreshExpStr as ms.StringValue);
    return new Date(Date.now() + expMs);
  }

  async refresh(
    user: { sub: number; refreshToken: string },
    clientMeta?: { ip?: string; userAgent?: string },
  ) {
    const { sub, refreshToken } = user;
    const matched = await this.refreshTokenService.findMatchingToken(
      sub,
      refreshToken,
    );

    if (!matched) {
      // reuse detection: token signature valid but not found in DB -> revoke all sessions for safety
      await this.refreshTokenService.deleteAllByUser(sub);
      throw new UnauthorizedException(
        'Refresh token reuse detected or token revoked',
      );
    }

    // matched -> check expiry
    if (matched.expiresAt.getTime() < Date.now()) {
      // delete expired token
      await this.refreshTokenService.deleteById(matched.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    // rotation: delete matched row
    await this.refreshTokenService.deleteById(matched.id);

    // issue new tokens
    const existingUser = await this.usersService.findById(sub);
    if (!existingUser) {
      // shouldn't happen but safe-guard
      await this.refreshTokenService.deleteAllByUser(sub);
      throw new UnauthorizedException('User not found');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.tokensService.getTokens(existingUser.id, existingUser.email, [
        existingUser.userType,
      ]);

    const expiresAt = this.getRefreshTokenExpiry();

    // save new refresh token
    await this.refreshTokenService.create(
      newRefreshToken,
      existingUser.id,
      expiresAt,
      clientMeta,
    );

    // enforce sessions limit
    const maxSessions = Number(
      this.configService.get<number>('REFRESH_TOKEN_MAX_SESSIONS') ?? 5,
    );
    await this.refreshTokenService.enforceMaxSessions(
      existingUser.id,
      maxSessions,
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(rawRefreshToken: string) {
    // verify payload to get userId
    const JWT_REFRESH_SECRET =
      this.configService.get<string>('JWT_REFRESH_SECRET');
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(rawRefreshToken, {
        secret: JWT_REFRESH_SECRET,
      });
    } catch (err) {
      // if token invalid -> nothing to revoke
      return;
    }

    const userId = Number(payload.sub);
    const matched = await this.refreshTokenService.findMatchingToken(
      userId,
      rawRefreshToken,
    );
    if (matched) {
      await this.refreshTokenService.deleteById(matched.id);
    }
    // done
  }

  // Logout all sessions
  async logoutAll(userId: number) {
    await this.refreshTokenService.deleteAllByUser(userId);
  }
}
