import { Repository, EntityRepository } from 'typeorm';
import { Card } from './card.entity';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { CardPreviewDto } from './dto/card-preview.dto';
@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  getCards(filterDto: GetCardsFilterDto): Promise<CardPreviewDto[]> {
    const { offset, limit, search } = filterDto;
    const query = this.createQueryBuilder('card');
    query.select('card.id, card.title, card.photo');
    if (search) {
      query.where(
        'LOWER(card.title) LIKE :search OR LOWER(card.description) LIKE :search',
        {
          search: `%${search.toLowerCase()}%`,
        },
      );
    }
    query.orderBy('card.id', 'DESC');
    query.skip(offset);
    query.take(limit);
    const headerCards: Promise<CardPreviewDto[]> = query.getRawMany();
    return headerCards;
  }
}
