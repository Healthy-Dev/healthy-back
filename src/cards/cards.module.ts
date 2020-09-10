import { Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardRepository } from './card.repository';
import { AuthModule } from '../auth/auth.module';
import { ImageManagementModule } from '../image-management/image-management.module';

@Module({
  imports: [TypeOrmModule.forFeature([CardRepository]), AuthModule, ImageManagementModule],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}
