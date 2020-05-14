import { Repository, EntityRepository } from 'typeorm';
import { Card } from './card.entity';
import { GetCardsFilterDto } from './dto/get-cards.dto';
@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
    getCards(filterDto: GetCardsFilterDto): Promise<Card[]> {
        const { offset, limit, search } = filterDto;
        const query = this.createQueryBuilder('card');
        query.select('card.id, card.title, card.photo');
        if (search) {
            query.where('card.title LIKE :search OR card.description LIKE :search', {
                search: `%${search}%`,
            });
        }
        query.orderBy('card.id', 'ASC');
        query.skip(offset);
        query.take(limit);
        const cards = query.getRawMany();
        return cards;
    }
}
