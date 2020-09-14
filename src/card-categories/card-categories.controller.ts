import { Controller, Get } from '@nestjs/common';
import { CardCategoriesService } from './card-categories.service';

@Controller()
export class CardCategoriesController {
  constructor(private cardCategoriesService: CardCategoriesService) {}
}
