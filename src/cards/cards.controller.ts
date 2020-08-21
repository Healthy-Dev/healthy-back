import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { CardPreviewDto } from './dto/card-preview.dto';
import { User } from 'src/users/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
@Controller()
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get('v1/cards')
  @UsePipes(new ValidationPipe({ transform: true }))
  getCards(@Query() filterDto: GetCardsFilterDto): Promise<CardPreviewDto[]> {
    return this.cardsService.getCards(filterDto);
  }

  @Get('v1/cards/:id')
  getCardById(@Param('id', ParseIntPipe) id: number): Promise<Card> {
    return this.cardsService.getCardById(id);
  }

  @Post('v1/cards')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  createCards(
    @Body() createCardsDto: CreateCardDto,
    @GetUser() user: User,
  ): Promise<{ id: number }> {
    return this.cardsService.createCards(createCardsDto, user);
  }
}
