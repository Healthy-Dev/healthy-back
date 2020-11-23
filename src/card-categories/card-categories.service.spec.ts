import { Test, TestingModule } from '@nestjs/testing';
import { CardCategoriesService } from './card-categories.service';
import { CardCategory } from './card-category.entity';
import { CardCategoryRepository } from './card-category.repository';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  findOne: jest.fn(),
});

describe('CardCategoriesService', () => {
  let service: CardCategoriesService;
  let repository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardCategoriesService,
      {provide: CardCategoryRepository, useFactory: mockRepository}],
    }).compile();

    service = module.get<CardCategoriesService>(CardCategoriesService);
    repository = module.get<CardCategoryRepository>(CardCategoryRepository);
  });
  describe('getCardCategoryById', () => {
    it('get card category by id from the repository', async () => {

      const mockCardCategory: CardCategory = new CardCategory();
      mockCardCategory.id = 1;
      mockCardCategory.name = 'name';
      const mockId = 1;
      repository.findOne.mockResolvedValue(mockCardCategory);
      expect(repository.findOne).not.toHaveBeenCalled();
      const result = await service.getCardCategoryById(mockId);
      expect(repository.findOne).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockCardCategory);
    });
    it('throws an error as category is not found', async () => {
      const mockId = 1;
      repository.findOne.mockResolvedValue(null);
      expect(service.getCardCategoryById(mockId)).rejects.toThrow(NotFoundException);
    });
  });
});