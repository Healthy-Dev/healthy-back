import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Module({
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
