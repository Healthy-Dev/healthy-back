import { Repository, EntityRepository } from 'typeorm';
import { CardCategory } from './card-category.entity';

@EntityRepository(CardCategory)
export class CardCategoryRepository extends Repository<CardCategory> {
  getCardsCategories(): Promise<CardCategory[]> {
    const query = this.createQueryBuilder('category');
    query.orderBy('category.name', 'ASC');
    return query.getMany();
  }
}
