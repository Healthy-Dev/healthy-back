import { Test, TestingModule } from '@nestjs/testing';
import { CardCategoriesService } from './card-categories.service';

describe('CardCategoriesService', () => {
  let service: CardCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardCategoriesService],
    }).compile();

    service = module.get<CardCategoriesService>(CardCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
