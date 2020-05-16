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
  createCards(@Body() createCardsDto: CreateCardDto): Promise<Card> {
    return this.cardsService.createCards(createCardsDto);
  }

  @Post('v1/cards/upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@UploadedFile() file) {
    console.log(file);
  }
}
