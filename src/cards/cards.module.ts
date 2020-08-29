import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardRepository } from './card.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CardRepository]), AuthModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
