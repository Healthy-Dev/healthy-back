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
  Put,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { CardPreviewDto } from './dto/card-preview.dto';
import { User } from '../users/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCardDto } from './dto/update-card.dto';
import { UserActiveValidationPipe } from '../users/pipes/user-active-validation.pipe';
import { CardCategory } from '../card-categories/card-category.entity';
import { CardCategoriesService } from '../card-categories/card-categories.service';

@Controller()
export class CardsController {
  constructor(
    private cardsService: CardsService,
    private cardCategoriesService: CardCategoriesService,
  ) {}

  @Get('v1/cards')
  @UsePipes(new ValidationPipe({ transform: true }))
  getCards(@Query() filterDto: GetCardsFilterDto): Promise<CardPreviewDto[]> {
    return this.cardsService.getCards(filterDto);
  }

  @Get('v1/cards/categories')
  getCardsCategories(): Promise<CardCategory[]> {
    return this.cardCategoriesService.getCardsCategories();
  }

  @Get('v1/cards/:id')
  getCardById(@Param('id', ParseIntPipe) id: number): Promise<Card> {
    return this.cardsService.getCardById(id);
  }

  @Post('v1/cards')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  createCard(
    @Body() createCardsDto: CreateCardDto,
    @GetUser(new UserActiveValidationPipe()) user: User,
  ): Promise<{ id: number }> {
    return this.cardsService.createCard(createCardsDto, user);
  }

  @Put('v1/cards/:id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )
  @UseGuards(AuthGuard())
  updateCard(
    @Body() updateCardDto: UpdateCardDto,
    @GetUser(new UserActiveValidationPipe()) user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Card> {
    if (Object.keys(updateCardDto).length === 0) {
      throw new BadRequestException(
        'Debe modificar al menos alguno de los campos, titulo, descripcion, imagen, link o categoría.',
      );
    }
    return this.cardsService.updateCard(updateCardDto, user, id);
  }

  @Delete('v1/cards/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  deleteCard(
    @GetUser(new UserActiveValidationPipe()) user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.cardsService.deleteCard(user, id);
  }

  @Post('v1/cards/:id/like')
  @UseGuards(AuthGuard())
  addLike(
    @GetUser(new UserActiveValidationPipe()) user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.cardsService.addLike(user, id);
  }

  @Delete('v1/cards/:id/like')
  @UseGuards(AuthGuard())
  deleteLike(
    @GetUser(new UserActiveValidationPipe()) user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.cardsService.deleteLike(user, id);
  }
}
