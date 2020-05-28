import {
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  Query,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { CardPreviewDto } from './dto/card-preview.dto';
import { Card } from './card.entity';
@Controller()
export class CardsController {
  constructor(private cardsService: CardsService) {}
  @Get('v1/cards')
  @UsePipes(new ValidationPipe({ transform: true }))
  getCards(@Query() filterDto: GetCardsFilterDto): Promise<CardPreviewDto[]> {
    return this.cardsService.getCards(filterDto);
  }

  @Get('v1/cards/:id')
  getCardsById(@Param('id', ParseIntPipe) id: number): Promise<Card> {
    return this.cardsService.getCardsById(id);
  }
}
