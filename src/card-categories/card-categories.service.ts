import { Injectable, NotFoundException } from '@nestjs/common';
import { CardCategory } from './card-category.entity';
import { CardCategoryRepository } from './card-category.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CardCategoriesService {
  constructor(
    @InjectRepository(CardCategory) private cardCategoryRepository: CardCategoryRepository,
  ) {}

  async getCardsCategories(): Promise<CardCategory[]> {
    return this.cardCategoryRepository.getCardsCategories();
  }

  async getCardCategoryById(id: number): Promise<CardCategory> {
    const cardCategory = await this.cardCategoryRepository.findOne(id);
    if (!cardCategory) {
      throw new NotFoundException(`Healthy Dev no encontró una categoría con el id ${id}`);
    }
    return cardCategory;
  }
}
