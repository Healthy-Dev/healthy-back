import { Repository, EntityRepository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { CardPreviewDto } from './dto/card-preview.dto';
import { User } from '../users/user.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  getCards(filterDto: GetCardsFilterDto): Promise<CardPreviewDto[]> {
    const { offset, limit, search } = filterDto;
    const query = this.createQueryBuilder('card');
    query.select('card.id, card.title, card.photo');
    if (search) {
      query.where('LOWER(card.title) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
      query.orWhere('LOWER(card.description) LIKE :search', {
        search: `%${search.toLowerCase()}%`,
      });
    }
    query.orderBy('card.id', 'DESC');
    query.offset(offset);
    query.limit(limit);
    const headerCards: Promise<CardPreviewDto[]> = query.getRawMany();
    return headerCards;
  }

  async createCards(
    createCardDto: CreateCardDto,
    user: User,
    photoUrl: string,
  ): Promise<{ id: number }> {
    const { title, description, externalUrl } = createCardDto;
    const card = new Card();
    card.title = title;
    card.description = description;
    card.externalUrl = externalUrl;
    card.photo = photoUrl;
    card.creator = user;
    await card.save();
    return { id: card.id };
  }

  async getCardById(id: number): Promise<Card> {
    const query = this.createQueryBuilder('card');
    query.addSelect(['user.id', 'user.name', 'user.profilePhoto']);
    query.leftJoin('card.creator', 'user');
    query.where('card.id = :id', { id });
    const card = await query.getOne();
    if (!card) {
      throw new NotFoundException(
        `Healthy Dev no encontró nada con el id ${id}`,
      );
    }
    return card;
  }
}
