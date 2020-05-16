import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardRepository } from './card.repository';
import { CreateCardDto } from './dto/create-card.dto';

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(Card) private cardRepository: CardRepository,
    ) {}
    async createCards(createCardsDto: CreateCardDto, file): Promise<Card> {
        return this.cardRepository.createCards(createCardsDto, file);
    }
}
