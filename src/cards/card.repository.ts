import { Repository, EntityRepository } from 'typeorm';
import { Card } from './card.entity';

@EntityRepository(Card)
export class TaskRepository extends Repository<Card> {

}
