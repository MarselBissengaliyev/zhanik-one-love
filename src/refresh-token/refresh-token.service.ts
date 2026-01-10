// src/refresh-token/refresh-token.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { RefreshToken } from 'generated/prisma';
@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcryptService: BcryptService,
  ) {}

  // Создать новую запись (принимаем уже raw token, внутри хэшируем)
  async create(rawToken: string, userId: number, expiresAt: Date, meta?: { ip?: string; userAgent?: string }) {
    const hashed = await this.bcryptService.hash(rawToken);

    return this.prisma.refreshToken.create({
      data: {
        token: hashed,
        userId,
        expiresAt,
        ip: meta?.ip,
        userAgent: meta?.userAgent,
      },
    });
  }

  // Найти все токены пользователя
  async findAllByUser(userId: number) {
    return this.prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Удалить один токен по id
  async deleteById(id: number) {
    return this.prisma.refreshToken.delete({ where: { id } });
  }

  // Удалить все токены пользователя (useful for reuse detection or logout all)
  async deleteAllByUser(userId: number) {
    return this.prisma.refreshToken.deleteMany({ where: { userId } });
  }

  // Ограничить количество сессий: если больше maxSessions, удалить старые
  async enforceMaxSessions(userId: number, maxSessions: number) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (tokens.length <= maxSessions) return;

    const idsToRemove = tokens.slice(maxSessions).map((t) => t.id);
    await this.prisma.refreshToken.deleteMany({ where: { id: { in: idsToRemove } } });
  }

  // Найти конкретный refresh token (rawToken) среди записей пользователя.
  // Возвращает запись, если rawToken совпал с одним из хэшей.
  async findMatchingToken(userId: number, rawToken: string): Promise<RefreshToken | null> {
    const tokens = await this.findAllByUser(userId);
    for (const t of tokens) {
      const isMatch = await this.bcryptService.compare(rawToken, t.token);
      if (isMatch) return t;
    }
    return null;
  }
}
