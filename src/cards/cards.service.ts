import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { CardRepository } from './card.repository';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { CardPreviewDto } from './dto/card-preview.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { User } from '../users/user.entity';
import { throwError } from 'rxjs';
import { UserStatus } from '../users/user-status.enum';

const cloudinary = require('cloudinary').v2;

@Injectable()
export class CardsService {
  constructor(@InjectRepository(Card) private cardRepository: CardRepository) {}

  async getCards(filterDto: GetCardsFilterDto): Promise<CardPreviewDto[]> {
    return this.cardRepository.getCards(filterDto);
  }

  async getCardById(id: number): Promise<Card> {
    return this.cardRepository.getCardById(id);
  }

  async createCards(
    createCardsDto: CreateCardDto,
    user: User,
  ): Promise<{ id: number }> {
    if (user.status === UserStatus.INACTIVO) {
      throw new UnauthorizedException(
        'Healthy dev le informa que debe activar la cuenta por email primero.',
      );
    }
    if (user.status === UserStatus.BANEADO) {
      throw new UnauthorizedException(
        'Healthy dev le informa que su cuenta se encuentra en revisión.',
      );
    }
    const { photo } = createCardsDto;
    let photoUrl =
      'http://res.cloudinary.com/du7xgj6ms/image/upload/v1589734759/placeholder.jpg';
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
    return this.cardRepository.createCards(createCardsDto, user, photoUrl);
  }
}
