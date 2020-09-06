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
import { UserStatus } from '../users/user-status.enum';
import { UpdateCardDto } from './dto/update-card.dto';
import { UpdateResult } from 'typeorm';

const cloudinary = require('cloudinary').v2;

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card) private cardRepository: CardRepository
  ) {}

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

  async updateCards(updateCardDto: UpdateCardDto, user: User, id: number): Promise<Card> {
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
    if (updateCardDto.photo) {
      let { photo } = await this.cardRepository.findOne(id);
      if (photo) {
        const strUrl = photo.split('/');
        let imagePublicId = '';
        strUrl.forEach(item => {
          if (item.match(/(.*)\.jpg/gm)) {
            imagePublicId = item.split('.')[0];
          }
        });
        if (imagePublicId !== 'placeholder') {
          await cloudinary.uploader.destroy(
            imagePublicId,
            { resource_type: 'image' },
            (res: any, error: any) => {
              if (error.result != 'ok') {
                throw new Error(error.result);
              }
            },
          );
        }
      }
      await cloudinary.uploader.upload(
        `data:image/jpg;base64,${updateCardDto.photo}`,
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
          updateCardDto.photo = response.url;
        },
      );
    }
    return this.cardRepository.updateCards(updateCardDto, id);
  }

  async deleteCard(user: User, id: number): Promise<{message: string}> {
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
    return this.cardRepository.deleteCard(id);
  }
}
