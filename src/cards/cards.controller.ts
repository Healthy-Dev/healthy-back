import { Controller, Get, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { CardsService } from './cards.service';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { Card } from './card.entity';
@Controller()
export class CardsController {
    constructor(private cardsService: CardsService) { }
    @Get('v1/cards')
    @UsePipes(new ValidationPipe({ transform: true }))
    getCards(@Query() filterDto: GetCardsFilterDto): Promise<Card[]> {
        return this.cardsService.getCards(filterDto);
    }
}
