import {
  Controller,
  ValidationPipe,
  Query,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UsePipes,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';

@Controller()
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Post('v1/cards')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  createCards(@Body() createCardsDto: CreateCardDto, @UploadedFile() file?: any): Promise<Card> {
    return this.cardsService.createCards(createCardsDto, file);
  }
}
