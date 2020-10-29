import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { CardRepository } from './card.repository';
import { ImageManagementService } from '../image-management/image-management.service';
import { CardCategoriesService } from '../card-categories/card-categories.service';
import { GetCardsFilterDto } from './dto/get-cards.dto';
import { Card } from './card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { User } from '../users/user.entity';
import { NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CardCategory } from '../card-categories/card-category.entity';
import { UpdateCardDto } from './dto/update-card.dto';

const mockRepository = () => ({
  getCards: jest.fn(),
  getCardById: jest.fn(),
  createCard: jest.fn(),
  findOne: jest.fn(),
  deleteCard: jest.fn(),
  updateCard: jest.fn(),
});

const mockImageManagementService = () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
  placeholderCardUrl: 'placeholderImage',
});

const mockCardCategoriesService = () => ({
  getCardCategoryById: jest.fn(),
});

const mockUser: User = new User();
mockUser.id = 1;
mockUser.username = 'username';
mockUser.email = 'email@email.com';
mockUser.password = 'Password1';

describe('CardsService', () => {
  let service: CardsService;
  let repository;
  let imageManagementService;
  let cardCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        { provide: CardRepository, useFactory: mockRepository},
        { provide: ImageManagementService, useFactory: mockImageManagementService},
        { provide: CardCategoriesService, useFactory: mockCardCategoriesService},
      ],
    }).compile();

    service = await module.get<CardsService>(CardsService);
    repository = await module.get<CardRepository>(CardRepository);
    imageManagementService = await module.get<ImageManagementService>(ImageManagementService);
    cardCategoriesService = await module.get<CardCategoriesService>(CardCategoriesService);
  });

  describe('getCards', () => {
    it('gets all cards from the repository', async () => {
      const mockCards = [];
      repository.getCards.mockResolvedValue(mockCards);
      expect(repository.getCards).not.toHaveBeenCalled();
      const filterDto: GetCardsFilterDto = {} as GetCardsFilterDto;
      const result = await service.getCards(filterDto);
      expect(repository.getCards).toHaveBeenCalled();
      expect(result).toEqual(mockCards);
    });
  });

  describe('getCardById', () => {
    it('get card by id from the repository', async () => {
      const mockId = 1;
      const mockCard: Card = new Card();
      mockCard.id = mockId;
      mockCard.title = 'title';
      repository.getCardById.mockResolvedValue(mockCard);
      expect(repository.getCardById).not.toHaveBeenCalled();
      const result = await service.getCardById(mockId);
      expect(repository.getCardById).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(mockCard);
    });
  });

  describe('createCard', () => {
    it('throws an error as category is not found', () => {
      const mockCreateCardDto: CreateCardDto = {title: 'title', description: 'description', photo: '', categoryId: 99, externalUrl: ''};
      cardCategoriesService.getCardCategoryById.mockResolvedValue(null);
      expect(service.createCard(mockCreateCardDto, mockUser)).rejects.toThrow(NotFoundException);
    });
    it('throws an error as image not save with photo', async () => {
      const mockCreateCardDto: CreateCardDto = {title: 'title', description: 'description', photo: 'aphoto', categoryId: 99, externalUrl: ''};
      const mockCardCardCategory: CardCategory = new CardCategory();
      mockCardCardCategory.id = 1;
      mockCardCardCategory.name = 'name';
      imageManagementService.uploadImage.mockRejectedValue(new Error());
      cardCategoriesService.getCardCategoryById.mockResolvedValue(mockCardCardCategory);
      repository.createCard.mockResolvedValue({id: 1});
      expect(service.createCard(mockCreateCardDto, mockUser)).rejects.toThrow(InternalServerErrorException);
    });
    it('call upload Image with photo assign result to photoUrl and return result',
        async () => {
      const mockCreateCardDto: CreateCardDto = {title: 'title', description: 'description', photo: 'aphoto', categoryId: 99, externalUrl: ''};
      const mockResult = {id: 1};
      const mockResultUploadImage = 'urlimage';
      const mockResultGetCardCategoryById = {id: 1, name: 'name'};
      imageManagementService.uploadImage.mockResolvedValue(mockResultUploadImage);
      cardCategoriesService.getCardCategoryById.mockResolvedValue(mockResultGetCardCategoryById);
      repository.createCard.mockResolvedValue(mockResult);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.createCard).not.toHaveBeenCalled();
      const result = await service.createCard(mockCreateCardDto, mockUser);
      expect(imageManagementService.uploadImage).toHaveBeenCalledWith(mockCreateCardDto.photo);
      expect(repository.createCard).toHaveBeenCalledWith(mockCreateCardDto, mockUser, mockResultUploadImage, mockResultGetCardCategoryById);
      expect(result).toEqual(mockResult);
    });
    it('not upload image calls assign placeholder to photoUrl and return result', async () => {
      const mockCreateCardDto: CreateCardDto = {title: 'title', description: 'description', photo: '', categoryId: 99, externalUrl: ''};
      const mockResult = {id: 1};
      const mockResultGetCardCategoryById = {id: 1, name: 'name'};
      cardCategoriesService.getCardCategoryById.mockResolvedValue(mockResultGetCardCategoryById);
      repository.createCard.mockResolvedValue(mockResult);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.createCard).not.toHaveBeenCalled();
      const result = await service.createCard(mockCreateCardDto, mockUser);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.createCard).toHaveBeenCalledWith(mockCreateCardDto, mockUser,
                                                         imageManagementService.placeholderCardUrl,
                                                         mockResultGetCardCategoryById);
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteCard', () => {
    const id = 99;
    it('delete card with photo successfully', async () => {
      const mockMessageDeleted = {message: 'card deleted succesfully'};
      const mockCard: Card = new Card();
      mockCard.id = 99;
      mockCard.photo = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockCard);
      imageManagementService.deleteImage.mockResolvedValue(true);
      repository.deleteCard.mockResolvedValue(mockMessageDeleted);
      const result = await service.deleteCard(mockUser, id);
      expect(repository.findOne).toHaveBeenCalledWith({ id, creator: mockUser });
      expect(imageManagementService.deleteImage).toHaveBeenCalledWith(mockCard.photo);
      expect(result).toEqual(mockMessageDeleted);
    });
    it('delete card without photo successfully', async () => {
      const mockMessageDeleted = {message: 'card deleted succesfully'};
      const mockCard: Card = new Card();
      mockCard.id = 99;
      repository.findOne.mockResolvedValue(mockCard);
      imageManagementService.deleteImage.mockResolvedValue(true);
      repository.deleteCard.mockResolvedValue(mockMessageDeleted);
      const result = await service.deleteCard(mockUser, id);
      expect(repository.findOne).toHaveBeenCalledWith({ id, creator: mockUser });
      expect(imageManagementService.deleteImage).not.toHaveBeenCalled();
      expect(result).toEqual(mockMessageDeleted);
    });
    it('throw error as card not found', async () => {
      const mockMessageDeleted = {message: 'card deleted succesfully'};
      repository.findOne.mockResolvedValue(null);
      imageManagementService.deleteImage.mockResolvedValue(true);
      repository.deleteCard.mockResolvedValue(mockMessageDeleted);
      expect(service.deleteCard(mockUser, id)).rejects.toThrow(NotFoundException);
    });
    it('throw error as photo can not deleted', async () => {
      const mockMessageDeleted = {message: 'card deleted succesfully'};
      const mockCard: Card = new Card();
      mockCard.id = 99;
      mockCard.photo = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockCard);
      imageManagementService.deleteImage.mockImplementation(() => {
        throw new Error();
      });
      expect(service.deleteCard(mockUser, id)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateCard', () => {
    const id = 99;
    it('throws an error as category is not found', () => {
      const mockupdateCardDto: UpdateCardDto = {title: 'title', description: 'description', photo: '', categoryId: 99, externalUrl: ''};
      cardCategoriesService.getCardCategoryById.mockResolvedValue(null);
      expect(service.updateCard(mockupdateCardDto, mockUser, id)).rejects.toThrow(NotFoundException);
    });
    it('throws an error as image not save with photo', async () => {
      const mockupdateCardDto: UpdateCardDto = {title: 'title', description: 'description', photo: 'aphoto', categoryId: 99, externalUrl: ''};
      imageManagementService.uploadImage.mockRejectedValue(new Error());
      cardCategoriesService.getCardCategoryById.mockResolvedValue({id: 1, name: 'name'});
      const mockCard: Card = new Card();
      mockCard.id = id;
      mockCard.photo = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockCard);
      expect(service.updateCard(mockupdateCardDto, mockUser, id)).rejects.toThrow(InternalServerErrorException);
    });
    it('throw error as card not found', async () => {
      const mockupdateCardDto: UpdateCardDto = {title: 'title', description: 'description', photo: 'aphoto', categoryId: 99, externalUrl: ''};
      repository.findOne.mockResolvedValue(null);
      const mockResultUploadImage = 'urlimage';
      imageManagementService.uploadImage.mockResolvedValue(mockResultUploadImage);
      imageManagementService.deleteImage.mockResolvedValue(true);
      expect(service.updateCard(mockupdateCardDto, mockUser, id)).rejects.toThrow(NotFoundException);
    });
    it('updated card with photo successfully',
        async () => {
      const mockPhoto = 'aphoto';
      const mockupdateCardDto: UpdateCardDto = {title: 'title', description: 'description', photo: mockPhoto, categoryId: 1, externalUrl: ''};
      const mockResult = {message: 'card updated'};
      const mockResultUploadImage = 'urlimage';
      const mockResultGetCardCategoryById = {id: 1, name: 'name'};
      const mockCard: Card = new Card();
      mockCard.id = id;
      mockCard.photo = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockCard);
      imageManagementService.uploadImage.mockResolvedValue(mockResultUploadImage);
      imageManagementService.deleteImage.mockResolvedValue(true);
      cardCategoriesService.getCardCategoryById.mockResolvedValue(mockResultGetCardCategoryById);
      repository.updateCard.mockResolvedValue(mockResult);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateCard).not.toHaveBeenCalled();
      const result = await service.updateCard(mockupdateCardDto, mockUser, id);
      expect(imageManagementService.uploadImage).toHaveBeenCalledWith(mockPhoto);
      expect(repository.updateCard).toHaveBeenCalledWith(mockupdateCardDto, id , mockUser, mockResultGetCardCategoryById);
      expect(result).toEqual(mockResult);
    });
    it('updated card without photo successfully', async () => {
      const mockPhoto = '';
      const mockupdateCardDto: UpdateCardDto = {title: 'title', description: 'description', photo: mockPhoto, categoryId: 1, externalUrl: ''};
      const mockResult = {message: 'card updated'};
      const mockResultUploadImage = 'urlimage';
      const mockResultGetCardCategoryById = {id: 1, name: 'name'};
      const mockCard: Card = new Card();
      mockCard.id = id;
      mockCard.photo = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockCard);
      imageManagementService.uploadImage.mockResolvedValue(mockResultUploadImage);
      imageManagementService.deleteImage.mockResolvedValue(true);
      cardCategoriesService.getCardCategoryById.mockResolvedValue(mockResultGetCardCategoryById);
      repository.updateCard.mockResolvedValue(mockResult);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateCard).not.toHaveBeenCalled();
      const result = await service.updateCard(mockupdateCardDto, mockUser, id);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateCard).toHaveBeenCalledWith(mockupdateCardDto, id , mockUser, mockResultGetCardCategoryById);
      expect(result).toEqual(mockResult);
    });
    it('updated card with photo successfully but logger error delete photo', async () => {
      const mockPhoto = 'aphoto';
      const mockupdateCardDto: UpdateCardDto = {title: 'title', description: 'description', photo: mockPhoto, categoryId: 1, externalUrl: ''};
      const mockResult = {message: 'card updated'};
      const mockResultUploadImage = 'urlimage';
      const mockResultGetCardCategoryById = {id: 1, name: 'name'};
      const mockCard: Card = new Card();
      mockCard.id = id;
      mockCard.photo = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockCard);
      imageManagementService.uploadImage.mockResolvedValue(mockResultUploadImage);
      imageManagementService.deleteImage.mockImplementation(() => {
        throw new Error();
      });
      cardCategoriesService.getCardCategoryById.mockResolvedValue(mockResultGetCardCategoryById);
      repository.updateCard.mockResolvedValue(mockResult);
      const loggerError = Logger.prototype.error = jest.fn();
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateCard).not.toHaveBeenCalled();
      const result = await service.updateCard(mockupdateCardDto, mockUser, id);
      expect(imageManagementService.uploadImage).toHaveBeenCalledWith(mockPhoto);
      expect(loggerError).toHaveBeenCalledTimes(1);
      expect(repository.updateCard).toHaveBeenCalledWith(mockupdateCardDto, id , mockUser, mockResultGetCardCategoryById);
      expect(result).toEqual(mockResult);
    });
  });

});
