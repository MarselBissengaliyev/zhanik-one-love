import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService],
  imports: [JwtModule, ConfigModule],
  exports: [TokensService]
})
export class TokensModule {}
