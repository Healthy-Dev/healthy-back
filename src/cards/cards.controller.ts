import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { CardPreviewDto } from './dto/card-preview.dto';

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
  
  @Post('v1/cards')
  @UsePipes(ValidationPipe)
  createCards(
    @Body() createCardsDto: CreateCardDto
  ): Promise<{id: number}> {
    return this.cardsService.createCards(createCardsDto);
  }
}
