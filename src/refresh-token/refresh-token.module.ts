import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RefreshTokenService } from './refresh-token.service';
import { BcryptModule } from 'src/bcrypt/bcrypt.module';

@Module({
  providers: [RefreshTokenService],
  imports: [PrismaModule, BcryptModule],
  exports: [RefreshTokenService]
})
export class RefreshTokenModule {}
