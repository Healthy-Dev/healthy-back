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
   async createCards(
      createCardsDto: CreateCardDto,
      file: any = 'http://res.cloudinary.com/du7xgj6ms/image/upload/v1589734759/tcu6xvx0hh62iyys05fs.jpg',
   ): Promise<Card> {
      let photoUrl: string = '';
      if (file.buffer) {
         const photoInBase64 = file.buffer.toString('base64');
         const type = file.mimetype;
         await cloudinary.uploader.upload(
            `data:${type};base64,${photoInBase64}`,
            (error: any, response: any) => {
               if (error) {
                  throw error;
               } else {
                  photoUrl = response.url;
               }
            },
         );
      }

      return this.cardRepository.createCards(
         createCardsDto,
         photoUrl ? photoUrl : file,
      );
   }
}
