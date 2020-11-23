import { Test, TestingModule } from '@nestjs/testing';
import { CardCategoriesController } from './card-categories.controller';

describe('CardCategories Controller', () => {
  let controller: CardCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardCategoriesController],
    }).compile();

    controller = module.get<CardCategoriesController>(CardCategoriesController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
