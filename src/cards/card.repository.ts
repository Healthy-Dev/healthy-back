import { Repository, EntityRepository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  async createCards(createCardDto: CreateCardDto, file): Promise<Card> {
    const { title, description, photo, externalUrl } = createCardDto;

    const card = new Card();
    card.title = title;
    card.description = description;
    card.externalUrl = externalUrl;

    const photoUrl = 'jsjs';

    card.photo = photoUrl;

    await card.save();

    return card;
  }
}
