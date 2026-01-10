import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, CacheModule.register()],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}