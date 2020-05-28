import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardRepository } from './card.repository';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { CardPreviewDto } from './dto/card-preview.dto';
@Injectable()
export class CardsService {
  constructor(@InjectRepository(Card) private cardRepository: CardRepository) {}
  async getCards(filterDto: GetCardsFilterDto): Promise<CardPreviewDto[]> {
    return this.cardRepository.getCards(filterDto);
  }

  async getCardsById(id: number): Promise<Card> {
    const cardFound = await this.cardRepository.findOne(id);

    if (!cardFound) {
      throw new NotFoundException(
        `Healthy Dev no encontró nada con el id ${id}, que esto no te impida seguir haciendo vida sana!`,
      );
    } else {
      return cardFound;
    }
  }
}
