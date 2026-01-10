import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Keyv } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true, // ✅ делает кэш глобальным
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get('REDIS_URL', 'redis://localhost:6379');
        const memoryTtl = configService.get('REDIS_MEMORY_TTL', 6000);
        const redisTtl = configService.get('CACHE_REDIS_TTL', 3600000);

        return {
          ttl: redisTtl,
          stores: [
            new Keyv({
              store: new CacheableMemory({
                ttl: memoryTtl,
                lruSize: 5000,
              }),
              namespace: 'memory',
            }),
            new Keyv({
              store: new KeyvRedis(redisUrl),
              ttl: redisTtl,
              namespace: 'redis',
            }),
          ],
        };
      },
    }),
  ],
  exports: [CacheModule], // ✅ теперь можно использовать в других модулях
})
export class CacheConfigModule {}
