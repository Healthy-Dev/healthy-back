import { Repository, EntityRepository } from 'typeorm';
import { Card } from './card.entity';

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {

}
