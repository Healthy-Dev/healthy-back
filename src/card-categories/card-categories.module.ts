import { Module } from '@nestjs/common';
import { CardCategoriesController } from './card-categories.controller';
import { CardCategoriesService } from './card-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardCategoryRepository } from './card-category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CardCategoryRepository])],
  controllers: [CardCategoriesController],
  providers: [CardCategoriesService],
  exports: [CardCategoriesService],
})
export class CardCategoriesModule {}
