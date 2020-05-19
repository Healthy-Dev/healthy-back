import { Repository, EntityRepository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  async createCards(createCardDto: CreateCardDto, file: string): Promise<{}> {
    const { title, description, externalUrl } = createCardDto;

    const card = new Card();
    card.title = title;
    card.description = description;
    card.externalUrl = externalUrl;
    card.photo = file;

    await card.save();

    return { idOfTheNewCard: card.id };
  }
}
