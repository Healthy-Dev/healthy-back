import {
   Controller,
   ValidationPipe,
   Query,
   Get,
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

   @Post('v1/cards')
   @UsePipes(ValidationPipe)
   @UseInterceptors(FileInterceptor('image'))
   createCards(
      @Body() createCardsDto: CreateCardDto,
      @UploadedFile() file?: any,
   ): Promise<{}> {
      return this.cardsService.createCards(createCardsDto, file);
   }
}
