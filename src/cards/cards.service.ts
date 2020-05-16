import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardRepository } from './card.repository';
@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(Card) private cardRepository: CardRepository,
    ) { }
}
