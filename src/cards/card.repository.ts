import { Repository, EntityRepository } from 'typeorm';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { CardPreviewDto } from './dto/card-preview.dto';
import { User } from '../users/user.entity';
import { NotFoundException } from '@nestjs/common';
import { UpdateCardDto } from './dto/update-card.dto';

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
  getCards(filterDto: GetCardsFilterDto): Promise<CardPreviewDto[]> {
    const { offset, limit, search, creatorId } = filterDto;
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
    if (creatorId) {
      query.leftJoin('card.creator', 'user');
      query.andWhere('user.id = :creatorId', { creatorId });
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
    query.addSelect(['user_like.id', 'user_like.username']);
    query.leftJoin('card.likesBy', 'user_like');
    query.where('card.id = :id', { id });
    const card = await query.getOne();
    if (!card) {
      throw new NotFoundException(
        `Healthy Dev no encontró nada con el id ${id}`,
      );
    }
    return card;
  }

  async updateCards(
    updateCardDto: UpdateCardDto,
    id: number,
    user: User,
  ): Promise<Card> {
    const updateCard = await this.update({id, creator: user}, updateCardDto);
    if (updateCard.affected === 0) {
      throw new NotFoundException(
        `Healthy Dev no pudo modificar la card con el id ${id}`,
      );
    }
    const card = await this.findOne(id);
    return card;
  }

  async deleteCard(id: number, user: User): Promise<{ message: string }> {
    const deleteCard = await this.delete({id, creator: user});
    if (deleteCard.affected === 0) {
      throw new NotFoundException(
        `Healthy Dev no pudo eliminar la card con el id ${id}`,
      );
    }
    return {
      message: `La Card con el id: ${id} fue eliminada con éxito.`,
    };
  }

  async addLike(user: User, id: number): Promise<{message: string}> {
    try {
      const card = await this.findOne(id)
      card.likesBy.push(user)
      await card.save()
    } catch (e) {
      throw new NotFoundException(`Hubo un error, el error es ${e}`)
    }
    return {
      message: "¡Me gusta!"
    }
  }

  async deleteLike(user: User, id: number): Promise<{message: string}> {
    try {
      const card = await this.findOne(id)
      card.likesBy = card.likesBy.filter(like => like.id !== user.id);
      await card.save()
    } catch (e) {
      throw new NotFoundException(`Hubo un error, el error es ${e}`)
    }
    return {
      message: "¡No me gusta más!"
    }
  }
}
