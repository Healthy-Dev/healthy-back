import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardRepository } from './card.repository';
import { CreateCardDto } from './dto/create-card.dto';

const cloudinary = require('cloudinary').v2;

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(Card) private cardRepository: CardRepository,
    ) {}
    async createCards(createCardsDto: CreateCardDto, file: any): Promise<Card> {
        console.log(file);
        await cloudinary.uploader.upload(file.originalname, (error: any, response: any) => {
            console.log(error);
            console.log(response)
        })

        return this.cardRepository.createCards(createCardsDto, file);
    }
}
