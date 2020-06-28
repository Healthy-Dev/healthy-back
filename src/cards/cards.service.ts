import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardRepository } from './card.repository';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { CardPreviewDto } from './dto/card-preview.dto';
import { CreateCardDto } from './dto/create-card.dto';

const cloudinary = require('cloudinary').v2;

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
        `Healthy Dev no encontró nada con el id ${id}`,
      );
    }

    return cardFound;
  }
  
  async createCards(createCardsDto: CreateCardDto): Promise<{id: number}> {
    let { photo } = createCardsDto;
    let photoUrl =
    'http://res.cloudinary.com/du7xgj6ms/image/upload/v1589734759/tcu6xvx0hh62iyys05fs.jpg';
    if (photo) {
      await cloudinary.uploader.upload(
        `data:image/jpg;base64,${photo}`,
        {
          format: 'jpg',
          resource_type: 'image',
          width: 500,
          height: 500,
          crop: 'limit',
          background: '#03111F',
        },
        (error: any, response: any) => {
          if (error) {
            throw error;
          }
          photoUrl = response.url;
        },
      );
    } 
    return this.cardRepository.createCards(createCardsDto, photoUrl);
  }
}
