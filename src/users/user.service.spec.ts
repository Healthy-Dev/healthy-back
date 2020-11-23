import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { ImageManagementService } from '../image-management/image-management.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { TokensService } from '../tokens/tokens.service';
import { TokenDto } from '../auth/dto/token.dto';
import { TokenType } from '../tokens/token-type.enum';

const mockRepository = () => ({
  findOne: jest.fn(),
  updateUser: jest.fn(),
});
const mockImageManagementService = () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
  placeholderUserUrl: 'placeholderImage',
});

const mockTokensService = () => ({
  verifyEncryptedToken: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repository;
  let imageManagementService;
  let tokensService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
      {provide: UserRepository, useFactory: mockRepository},
      {provide: ImageManagementService, useFactory: mockImageManagementService},
      {provide: TokensService, useFactory: mockTokensService},
    ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    repository = module.get<UserRepository>(UserRepository);
    imageManagementService = module.get<ImageManagementService>(ImageManagementService);
    tokensService = module.get<TokensService>(TokensService);
  });

  const mockUsername = 'usernameTest';

  describe('updateUser', () => {
    const id = 99;
    it('throws an error as image not save with photo', async () => {
      const mockupdateUserDto: UpdateUserDto = {name: 'name', profilePhoto: 'photo', twitter: 'twitter', instagram: 'instagram'};
      imageManagementService.uploadImage.mockRejectedValue(new Error());
      const mockUser: User = new User();
      mockUser.id = id;
      mockUser.profilePhoto = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockUser);
      expect(service.updateUser(mockupdateUserDto, mockUsername)).rejects.toThrow(InternalServerErrorException);
    });

    it('updated user with profile photo successfully', async () => {
      const mockPhoto = 'aphoto';
      const mockupdateUserDto: UpdateUserDto = {name: 'name', profilePhoto: mockPhoto, twitter: 'twitter', instagram: 'instagram'};
      const mockResult = {message: 'User updated'};
      const mockResultUploadImage = 'urlimage';
      const mockUser: User = new User();
      mockUser.id = id;
      mockUser.profilePhoto = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockUser);
      imageManagementService.uploadImage.mockResolvedValue(mockResultUploadImage);
      imageManagementService.deleteImage.mockResolvedValue(true);
      repository.updateUser.mockResolvedValue(mockResult);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateUser).not.toHaveBeenCalled();
      const result = await service.updateUser(mockupdateUserDto, mockUsername);
      expect(imageManagementService.uploadImage).toHaveBeenCalledWith(mockPhoto);
      expect(repository.updateUser).toHaveBeenCalledWith(mockupdateUserDto, mockUsername);
      expect(result).toEqual(mockResult);
    });

    it('updated user without profile photo successfully', async () => {
      const mockPhoto = '';
      const mockupdateUserDto: UpdateUserDto = {name: 'name', profilePhoto: mockPhoto, twitter: 'twitter', instagram: 'instagram'};
      const mockResult = {message: 'user updated'};
      const mockResultUploadImage = 'urlimage';
      const mockResultGetCardCategoryById = {id: 1, name: 'name'};
      const mockUser: User = new User();
      mockUser.id = id;
      mockUser.profilePhoto = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockUser);
      imageManagementService.uploadImage.mockResolvedValue(mockResultUploadImage);
      imageManagementService.deleteImage.mockResolvedValue(true);
      repository.updateUser.mockResolvedValue(mockResult);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateUser).not.toHaveBeenCalled();
      const result = await service.updateUser(mockupdateUserDto, mockUsername);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateUser).toHaveBeenCalledWith(mockupdateUserDto, mockUsername);
      expect(result).toEqual(mockResult);
    });
    it('updated user with photo successfully but logger error delete photo', async () => {
      const mockPhoto = 'aphoto';
      const mockupdateUserDto: UpdateUserDto = {name: 'name', profilePhoto: mockPhoto, twitter: 'twitter', instagram: 'instagram'};
      const mockResult = {message: 'User updated'};
      const mockResultUploadImage = 'urlimage';
      const mockUser: User = new User();
      mockUser.id = id;
      mockUser.profilePhoto = 'urlPhoto';
      repository.findOne.mockResolvedValue(mockUser);
      imageManagementService.uploadImage.mockResolvedValue(mockResultUploadImage);
      imageManagementService.deleteImage.mockImplementation(() => {
        throw new Error();
      });
      const loggerError = Logger.prototype.error = jest.fn();
      repository.updateUser.mockResolvedValue(mockResult);
      expect(imageManagementService.uploadImage).not.toHaveBeenCalled();
      expect(repository.updateUser).not.toHaveBeenCalled();
      const result = await service.updateUser(mockupdateUserDto, mockUsername);
      expect(imageManagementService.uploadImage).toHaveBeenCalledWith(mockPhoto);
      expect(loggerError).toHaveBeenCalledTimes(1);
      expect(repository.updateUser).toHaveBeenCalledWith(mockupdateUserDto, mockUsername);
      expect(result).toEqual(mockResult);
    });
  });

  describe('delete user by token', () => {
    const messageTokenInvalid = 'Healthy Dev le informa que no ha podido eliminar cuenta, token no valido';
    let user;
    beforeEach(async () => {
      user = new User();
      user.username = 'test';
    });
    it('return message user deleted succesfully', async () => {
      const mocktokenDto: TokenDto = {token: 'token'};
      tokensService.verifyEncryptedToken.mockResolvedValue({
        email: 'test@test.com',
        type: TokenType.DELETE_USER,  iat: 123,
        exp: 321,
      });
      service.getUserByEmail = jest.fn().mockResolvedValue(user);
      user.remove = jest.fn();
      const result = await service.deleteUserByToken(mocktokenDto);
      expect(user.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Healthy Dev le informa que el usuario ha sido eliminado' });
    });

    it('throw an error as not delete user because verifyEncryptedToken throw error', async () => {
      const mocktokenDto: TokenDto = {token: 'token'};
      tokensService.verifyEncryptedToken.mockImplementation(() => {
        throw new Error();
      });
      service.getUserByEmail = jest.fn().mockResolvedValue(user);
      user.save = jest.fn();
      expect(service.deleteUserByToken(mocktokenDto)).rejects.toThrow(UnauthorizedException);
    });

    it('throw an error as not delete user because token payload type not was delete user', async () => {
      const mocktokenDto: TokenDto = {token: 'token'};
      tokensService.verifyEncryptedToken.mockResolvedValue({
        email: 'test@test.com',
        type: TokenType.RESET_PASSWORD,  iat: 123,
        exp: 321,
      });
      service.getUserByEmail = jest.fn().mockResolvedValue(user);
      user.remove = jest.fn();
      expect(service.deleteUserByToken(mocktokenDto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws an error as user not found', async () => {
      const mocktokenDto: TokenDto = {token: 'token'};
      tokensService.verifyEncryptedToken.mockResolvedValue({
        email: 'test@test.com',
        type: TokenType.DELETE_USER,  iat: 123,
        exp: 321,
      });
      service.getUserByEmail = jest.fn().mockResolvedValue(null);
      user.remove = jest.fn();
      expect(service.deleteUserByToken(mocktokenDto)).rejects.toThrow(NotFoundException);
    });
  });

});
